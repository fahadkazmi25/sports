import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const league = searchParams.get('league');
        const search = searchParams.get('search')?.toLowerCase();
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const sort = searchParams.get('sort') || 'time'; // time, league, home, away
        const includeStats = searchParams.get('includeStats') === 'true';

        const filePath = path.join(process.cwd(), 'response.json');
        const jsonData = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(jsonData);

        let matches = data.matches || [];

        // Stats calculation (mandatory if requested)
        let leagueStats: Record<string, number> = {};
        if (includeStats) {
            matches.forEach((m: any) => {
                if (m.league) {
                    leagueStats[m.league] = (leagueStats[m.league] || 0) + 1;
                }
            });
        }

        // Defensive filtering and mapping
        if (league) {
            matches = matches.filter((m: any) =>
                m.league?.toLowerCase().replace(/\s+/g, '-') === league.toLowerCase() ||
                m.league?.toLowerCase() === league.toLowerCase()
            );
        }

        if (search) {
            matches = matches.filter((m: any) =>
                m.home?.toLowerCase().includes(search) ||
                m.away?.toLowerCase().includes(search) ||
                m.league?.toLowerCase().includes(search)
            );
        }

        // Sort logic
        matches.sort((a: any, b: any) => {
            if (sort === 'time') return (a.ts || 0) - (b.ts || 0);
            if (sort === 'league') return (a.league || '').localeCompare(b.league || '');
            if (sort === 'home') return (a.home || '').localeCompare(b.home || '');
            if (sort === 'away') return (a.away || '').localeCompare(b.away || '');
            return 0;
        });

        // Pagination
        const total = matches.length;
        const startIndex = (page - 1) * limit;
        const paginatedMatches = matches.slice(startIndex, startIndex + limit);

        return NextResponse.json({
            matches: paginatedMatches,
            count: paginatedMatches.length,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            leagueStats: includeStats ? leagueStats : undefined,
            generated_at: data.generated_at
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to fetch matches', matches: [] }, { status: 500 });
    }
}
