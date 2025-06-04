export interface IpoComprehensiveAnalysis {
    _id: string; // Handle MongoDB ObjectId format
    ipo_table_id: string;
    company_name: string;
    fundamentals: IpoFundamentals;
    risk_meter: {
        score: number;
        summary: string;
        key_risks: string[];
        risk_categories: {
            financial_risks: string[];
            market_risks: string[];
            operational_risks: string[];
            regulatory_risks: string[];
        };
        risk_mitigation: string;
    };
    flexibility: {
        score: number;
        summary: string;
        market_adaptability: {
            score: number;
            description: string;
        };
        financial_stability: {
            score: number | null; // Can be null
            description: string | null; // Can be null
        };
        operational_agility: {
            score: number;
            description: string;
        };
        product_diversification: string;
        pivoting_history: string[];
        future_adaptability_potential: string;
    };
    time: {
        score: number;
        summary: string;
        issue_dates: {
            opening: string;
            closing: string;
        };
        listing_details: {
            expected_date: string;
            exchanges: string[];
        };
        allotment_timeline: {
            date: string;
            process: string;
        };
        key_milestones: {
            date: string;
            event: string;
        }[];
        market_timing_assessment: string;
        time_to_market: {
            score: number;
            rationale: string;
        };
        // Remove duplicated properties that belong in flexibility
        // These were incorrectly duplicated in the time section
    };
    performance: {
        score: number;
        summary: string;
        historical_growth: {
            pattern: string;
            rate: string;
            consistency: string;
        };
        key_achievements: string[];
        management_quality: {
            experience: string;
            track_record: string;
            score: number;
        };
        market_comparison: string;
        future_potential: {
            growth_forecast: string;
            upcoming_projects: string[];
        };
        consistency_analysis: {
            operational_years: number;
            revenue_stability: string;
            rationale: string;
        };
    };
    ipo_details: {
        issue_size: string;
        price_band: string;
        lot_size: number;
        allocation_details: {
            retail: number;
            qib: number;
            nii: number;
        };
        approximate_gains_potential: number;
        gains_rationale: string;
        profitability_of_allotment: {
            score: number;
            assessment: string;
        };
    };
    summary_metrics: {
        fundamentals_score: number;
        risk_meter: number;
        flexibility_score: number;
        time_score: number;
        performance_score: number;
        approximate_gains_potential: number;
        profitability_of_allotment: number;
        total_revenue: number;
        net_profit: number;
        total_assets: number;
    };
}

interface IpoFundamentals {
    score: number;
    summary: string;
    market_position: string;
    business_model: string;
    revenue_details: {
        total_revenue: number;
        revenue_cagr: number;
        revenue_trend: string;
    };
    profit_analysis: {
        net_profit: number;
        profit_margin: number;
        ebitda: number | null; // Can be null
        profit_trend: string;
    };
    assets_and_liabilities: {
        total_assets: number;
        total_liabilities: number | null; // Can be null
        debt_to_equity_ratio: number | null; // Can be null
    };
    financial_ratios: {
        current_ratio: string | null; // Can be null
        quick_ratio: string | null; // Can be null
        return_on_equity: string | null; // Can be null
    };
}