// app/api/ipo/analysis/comprehensive/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      ipo_table_id,
      company_name,
      image_url,
      risk,
      performance,
      flexibility,
      fundamentals,
      time,
      ipo_details
    } = body;

    // Validate required fields
    if (!ipo_table_id || !company_name) {
      return NextResponse.json({
        success: false,
        message: "IPO table ID and company name are required"
      }, { status: 400 });
    }

    // Validate required analysis data
    const requiredFields = ['risk', 'performance', 'flexibility', 'fundamentals', 'time'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Missing required analysis data: ${missingFields.join(', ')}`
      }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    // Get IPO record to extract dates and other info
    let ipoRecord;
    try {
      // Try as ObjectId first
      ipoRecord = await db.collection("ipos").findOne({ _id: new ObjectId(ipo_table_id) });
    } catch {
      // If not a valid ObjectId, try as string
      ipoRecord = await db.collection("ipos").findOne({
        $or: [
          { _id: ipo_table_id },
          { slug: ipo_table_id },
          { upcoming_ipo_2025: { $regex: ipo_table_id, $options: "i" } }
        ]
      });
    }

    if (!ipoRecord) {
      return NextResponse.json({
        success: false,
        message: "IPO record not found"
      }, { status: 404 });
    }

    // Extract dates from IPO record
    const ipoDates = ipoRecord.ipo_dates || {};
    const extractedDates = {
      opening: ipoDates.ipo_open_date || '',
      closing: ipoDates.ipo_close_date || '',
      listing_date: ipoDates.ipo_listing_date || '',
      basis_of_allotment: ipoDates.basis_of_allotment || '',
      refunds: ipoDates.refunds || '',
      credit_to_demat: ipoDates.credit_to_demat_account || ''
    };

    // Build comprehensive analysis document
    const analysisDoc = {
      ipo_table_id: ipoRecord._id.toString(),
      company_name: company_name,
      image_url: image_url || ipoRecord.image_url || '',
      fundamentals: {
        score: fundamentals.fundamentals_score || 0,
        summary: fundamentals.fundamentals_summary || '',
        market_position: fundamentals.market_position || '',
        business_model: fundamentals.business_model || '',
        revenue_details: fundamentals.revenue_details || {
          total_revenue: 0,
          revenue_cagr: 0,
          revenue_trend: ''
        },
        profit_analysis: fundamentals.profit_analysis || {
          net_profit: 0,
          profit_margin: 0,
          ebitda: null,
          profit_trend: ''
        },
        assets_and_liabilities: fundamentals.assets_and_liabilities || {
          total_assets: 0,
          total_liabilities: null,
          debt_to_equity_ratio: null
        },
        financial_ratios: fundamentals.financial_ratios || {
          current_ratio: null,
          quick_ratio: null,
          return_on_equity: null
        }
      },
      risk_meter: {
        score: risk.risk_meter || 0,
        summary: risk.risk_summary || '',
        key_risks: risk.key_risks || [],
        risk_categories: risk.risk_categories || {
          financial_risks: [],
          market_risks: [],
          operational_risks: [],
          regulatory_risks: []
        },
        risk_mitigation: risk.risk_mitigation || ''
      },
      flexibility: {
        score: flexibility.flexibility_score || 0,
        summary: flexibility.flexibility_summary || '',
        market_adaptability: flexibility.market_adaptability || {
          score: 0,
          description: ''
        },
        financial_stability: flexibility.financial_stability || {
          score: null,
          description: null
        },
        operational_agility: flexibility.operational_agility || {
          score: 0,
          description: ''
        },
        product_diversification: flexibility.product_diversification || '',
        pivoting_history: flexibility.pivoting_history || [],
        future_adaptability_potential: flexibility.future_adaptability_potential || ''
      },
      time: {
        score: time.time_score || 0,
        summary: time.time_summary || '',
        issue_dates: {
          opening: extractedDates.opening,
          closing: extractedDates.closing
        },
        listing_details: {
          expected_date: extractedDates.listing_date,
          exchanges: (time.listing_details || {}).exchanges || []
        },
        allotment_timeline: {
          date: extractedDates.basis_of_allotment,
          process: (time.allotment_timeline || {}).process || ''
        },
        key_milestones: time.key_milestones || [],
        market_timing_assessment: time.market_timing_assessment || '',
        time_to_market: time.time_to_market || {
          score: 0,
          rationale: ''
        }
      },
      performance: {
        score: performance.performance_score || 0,
        summary: performance.performance_summary || '',
        historical_growth: performance.historical_growth || {
          pattern: '',
          rate: '',
          consistency: ''
        },
        key_achievements: performance.key_achievements || [],
        management_quality: performance.management_quality || {
          experience: '',
          track_record: '',
          score: 0
        },
        market_comparison: performance.market_comparison || '',
        future_potential: performance.future_potential || {
          growth_forecast: '',
          upcoming_projects: []
        },
        consistency_analysis: performance.consistency_analysis || {
          operational_years: 0,
          revenue_stability: '',
          rationale: ''
        }
      },
      ipo_details: ipo_details || {
        issue_size: ipoRecord.ipo_size || '',
        price_band: ipoRecord.price_band || '',
        lot_size: 0,
        allocation_details: {
          retail: 0,
          qib: 0,
          nii: 0
        },
        approximate_gains_potential: 0,
        gains_rationale: '',
        profitability_of_allotment: {
          score: 0,
          assessment: ''
        }
      },
      summary_metrics: {
        fundamentals_score: fundamentals.fundamentals_score || 0,
        risk_meter: risk.risk_meter || 0,
        flexibility_score: flexibility.flexibility_score || 0,
        time_score: time.time_score || 0,
        performance_score: performance.performance_score || 0,
        approximate_gains_potential: (ipo_details || {}).approximate_gains_potential || 0,
        profitability_of_allotment: ((ipo_details || {}).profitability_of_allotment || {}).score || 0,
        total_revenue: ((fundamentals.revenue_details || {}).total_revenue) || 0,
        net_profit: ((fundamentals.profit_analysis || {}).net_profit) || 0,
        total_assets: ((fundamentals.assets_and_liabilities || {}).total_assets) || 0
      },
      created_at: new Date(),
      updated_at: new Date()
    };

    // Check if document with same ipo_table_id already exists
    const existingDoc = await db.collection("ipo_comprehensive_analysis")
      .findOne({ ipo_table_id: analysisDoc.ipo_table_id });

    let result;
    if (existingDoc) {
      // Update existing document
      analysisDoc.updated_at = new Date();
      // Preserve created_at from existing document
      analysisDoc.created_at = existingDoc.created_at;

      result = await db.collection("ipo_comprehensive_analysis")
        .updateOne(
          { ipo_table_id: analysisDoc.ipo_table_id },
          { $set: analysisDoc }
        );

      return NextResponse.json({
        success: true,
        message: "Analysis updated successfully",
        data: {
          _id: existingDoc._id,
          modified_count: result.modifiedCount,
          company_name: analysisDoc.company_name,
          scores: analysisDoc.summary_metrics
        }
      });
    } else {
      // Insert new document
      result = await db.collection("ipo_comprehensive_analysis")
        .insertOne(analysisDoc);

      return NextResponse.json({
        success: true,
        message: "Analysis created successfully",
        data: {
          _id: result.insertedId,
          company_name: analysisDoc.company_name,
          scores: analysisDoc.summary_metrics
        }
      });
    }

  } catch (error) {
    console.error("Error in comprehensive analysis API:", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error"
    }, { status: 500 });
  }
}

// GET method to retrieve existing analysis
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ipoTableId = searchParams.get('ipo_table_id');

    if (!ipoTableId) {
      return NextResponse.json({
        success: false,
        message: "IPO table ID is required"
      }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const analysis = await db.collection("ipo_comprehensive_analysis")
      .findOne({ ipo_table_id: ipoTableId });

    if (!analysis) {
      return NextResponse.json({
        success: false,
        message: "Analysis not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error("Error retrieving analysis:", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error"
    }, { status: 500 });
  }
}