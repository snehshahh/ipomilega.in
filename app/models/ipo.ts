export interface Ipo {
    _id: string;
    upcoming_ipo_2025: string;
    open_date: string;
    closing_date: string;
    ipo_type: string;
    ipo_size: string;
    price_band: string;
    detail_url: string;
    scraped_at: string;
    about: string;
    financial_report: FinancialReport[];
    ipo_dates: IpoDates;
    ipo_details: IpoDetails;
    ipo_market_lot: IpoMarketLot[],
    promoters: string;
    rhp_url: string;
}

export interface FinancialReport {
    period_ended: string;
    revenue: string;
    expense: string;
    profit_after_tax: string;
    assets: string;
}

export interface IpoMarketLot {
    application: string;
    lot_size: string;
    shares: string;
    amount: string;
}

export interface IpoDates {
    ipo_open_date: string;
    ipo_close_date: string;
    basis_of_allotment: string;
    refunds: string;
    credit_to_demat_account: string;
    ipo_listing_date: string;
}

export interface IpoDetails {
    ipo_open_date: string;
    ipo_close_date: string;
    face_value: string;
    ipo_price_band: string;
    issue_size: string;
    fresh_issue: string;
    issue_type: string;
    ipo_listing: string;
    retail_quota: string;
    qib_quota: string;
    nii_quota: string;
    drhp_draft_prospectus: string;
    drhp_link: string;
    drhp_draft_prospectus_links: [
      {
        text: string,
        href: string
      }
    ],
    rhp_draft_prospectus: string,
    rhp_link: string,
    rhp_draft_prospectus_links: [
      {
        text: string,
        href: string
      }
    ],
    anchor_investors_list: string,
    anchor_investors_list_links: [
      {
        text: string,
        href: string
      }
    ]
}