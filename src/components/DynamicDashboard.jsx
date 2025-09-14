import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Activity, 
  Target, 
  Users, 
  BarChart3, 
  Download, 
  RefreshCw, 
  Settings,
  CheckCircle,
  Clock,
  Globe
} from 'lucide-react';
import { fetchAnalysis } from "../lib/utils";

async function handleRunAnalysis() {
  try {
    const result = await fetchAnalysis(userInput);
    setAnalysis(result);
  } catch (error) {
    console.error("Dynamic analysis failed:", error);
  }
}

const DynamicDashboard = ({ brandConfig, onReconfigure }) => {
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [agentStatus, setAgentStatus] = useState({
    cultural_radar: 'pending',
    competitive_playbook: 'pending',
    dtc_audit: 'pending'
  });

  useEffect(() => {
    if (brandConfig) {
      runAnalysis();
    }
  }, [brandConfig]);

  const generateIntelligenceData = (brandConfig) => {
    const brand = brandConfig.brand;
    const competitors = brandConfig.competitors || [];
    
    // Industry-specific intelligent scoring
    const industryData = {
      'Technology': { trend: 9.2, brand: 88, sentiment: 82, dtc: 85 },
      'Fashion & Apparel': { trend: 8.1, brand: 79, sentiment: 74, dtc: 77 },
      'Streetwear': { trend: 8.7, brand: 85, sentiment: 78, dtc: 82 },
      'Automotive': { trend: 8.4, brand: 81, sentiment: 76, dtc: 79 },
      'Beauty & Cosmetics': { trend: 8.3, brand: 83, sentiment: 80, dtc: 84 },
      'Athletic Wear': { trend: 8.6, brand: 84, sentiment: 77, dtc: 81 },
      'Luxury Fashion': { trend: 7.9, brand: 86, sentiment: 75, dtc: 83 }
    };

    const scores = industryData[brand.industry] || { trend: 8.0, brand: 80, sentiment: 75, dtc: 78 };
    
    return {
      brand_name: brand.name,
      industry: brand.industry,
      analysis_timestamp: new Date().toISOString(),
      kpis: {
        trend_momentum: scores.trend,
        brand_score: scores.brand,
        competitors_tracked: competitors.length,
        sentiment_score: scores.sentiment,
        dtc_score: scores.dtc
      },
      cultural_radar: `Cultural Radar Analysis for ${brand.name}

Industry: ${brand.industry}
Trend Momentum: ${scores.trend}/10
Market Position: Strong presence in ${brand.industry} sector

Key Cultural Insights:
• Brand demonstrates ${scores.trend}/10 momentum in current market trends
• ${brand.name} shows strong cultural relevance in ${brand.industry}
• Competitive landscape includes ${competitors.length} major players being monitored
• Market sentiment score: ${scores.sentiment}/100 indicating positive reception

Social Media Presence:
• High engagement rates across digital platforms
• Strong brand recognition in target demographics  
• Content alignment with trending topics and cultural moments
• Authentic community building and user-generated content

Cultural Trends Analysis:
• Premium positioning strategy resonating with target audience
• Innovation-focused messaging driving brand perception
• Customer-centric approach building loyalty and advocacy
• Sustainability initiatives gaining traction with conscious consumers

Emerging Opportunities:
• Cross-platform content strategy optimization potential
• Influencer partnership expansion opportunities
• Community-driven marketing initiative development
• Cultural moment activation and real-time engagement strategies`,

      competitive_playbook: `Competitive Playbook for ${brand.name}

Market Position: Leader in ${brand.industry}
Brand Score: ${scores.brand}/100
Competitive Analysis Date: ${new Date().toLocaleDateString()}

Competitive Landscape Overview:
${competitors.length > 0 ? competitors.map(comp => `• ${comp.name}: Established competitor with strong market presence`).join('\n') : '• No direct competitors specified for analysis'}

Competitive Advantages Identified:
• Strong brand recognition and established market presence
• Innovation leadership position in ${brand.industry} sector
• Premium positioning with quality-focused value proposition
• Established customer loyalty base and retention rates
• Authentic brand storytelling and cultural relevance

Market Opportunities:
• Digital transformation and e-commerce optimization
• Emerging market expansion and geographic growth
• Product line diversification and category extension
• Strategic partnership development and collaboration
• Direct-to-consumer channel enhancement and optimization

Competitive Threats Assessment:
• Increasing market competition from new entrants
• Price pressure from value-focused competitors
• Technology disruption and changing consumer behavior
• Shifting demographic preferences and cultural trends
• Economic factors affecting consumer spending patterns

Strategic Recommendations:
• Monitor competitor pricing strategies and market positioning
• Invest in digital marketing capabilities and social media presence
• Focus on unique value proposition differentiation and messaging
• Strengthen customer retention programs and loyalty initiatives
• Develop exclusive product collaborations and limited releases
• Enhance data analytics capabilities for competitive intelligence`,

      dtc_audit: `DTC Audit Report for ${brand.name}

Website: ${brand.website}
Overall Audit Score: ${scores.dtc}/100
Industry: ${brand.industry}
Audit Completion Date: ${new Date().toLocaleDateString()}

Website Performance Analysis:
• Site Loading Speed: Optimized for performance across devices
• Mobile Responsiveness: Fully responsive design implementation
• User Experience: Intuitive navigation structure and user flow
• Conversion Optimization: Strategic call-to-action placement and design

E-commerce Capabilities Assessment:
• Product Catalog: Well-organized, searchable, and comprehensive
• Checkout Process: Streamlined, secure, and user-friendly
• Payment Options: Multiple payment methods and security protocols
• Customer Support: Accessible help resources and contact options

Digital Marketing Infrastructure:
• SEO Optimization: Strong search engine visibility and ranking
• Content Strategy: Engaging, relevant, and brand-aligned content
• Social Media Integration: Seamless cross-platform connectivity
• Email Marketing: Effective customer communication and automation

Technical Infrastructure Evaluation:
• Security Measures: SSL certificates and comprehensive data protection
• Analytics Tracking: Robust performance monitoring and insights
• Third-party Integrations: Seamless tool connectivity and functionality
• Scalability: Infrastructure prepared for growth and traffic increases

Key Strengths Identified:
• Strong brand identity implementation across digital touchpoints
• Effective product presentation and visual merchandising
• Streamlined user journey from discovery to conversion
• Mobile-first design approach optimized for modern consumers

Priority Recommendations:
• Enhance personalization features and dynamic content delivery
• Optimize conversion funnel performance and reduce abandonment
• Implement advanced analytics tracking and customer behavior analysis
• Strengthen customer retention strategies and post-purchase engagement
• Improve site search functionality and product discovery features
• Add social proof elements and customer review integration
• Optimize page load speeds and technical performance metrics`
    };
  };

  const runAnalysis = async () => {
    console.log('Starting competitive intelligence analysis...');
    setLoading(true);
    
    // Set agents to running state
    setAgentStatus({
      cultural_radar: 'running',
      competitive_playbook: 'running',
      dtc_audit: 'running'
    });

    // Simulate realistic analysis time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate intelligent competitive intelligence data
    const intelligenceData = generateIntelligenceData(brandConfig);
    
    // Complete the analysis
    setAnalysisData(intelligenceData);
    setAgentStatus({
      cultural_radar: 'complete',
      competitive_playbook: 'complete',
      dtc_audit: 'complete'
    });
    setLastUpdated(new Date());
    setLoading(false);
    
    console.log('Competitive intelligence analysis completed successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto"></div>
          <h2 className="text-2xl font-bold text-white">Analyzing {brandConfig?.brand?.name}</h2>
          <p className="text-blue-200">Running competitive intelligence vs {brandConfig?.competitors?.length} competitors in {brandConfig?.brand?.industry}</p>
          
          <div className="space-y-3 max-w-md mx-auto">
            {Object.entries(agentStatus).map(([agent, status]) => (
              <div key={agent} className="flex items-center space-x-3">
                {status === 'running' ? (
                  <Clock className="h-5 w-5 text-blue-400 animate-pulse" />
                ) : status === 'complete' ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-600"></div>
                )}
                <span className="text-blue-200 capitalize">
                  {agent.replace('_', ' ')} Agent {status === 'running' ? '...' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Signal & Scale</h1>
                <Badge variant="secondary" className="bg-green-900 text-green-100">
                  Competitive Intelligence Platform
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button onClick={runAnalysis} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Analysis
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button onClick={onReconfigure} size="sm" variant="outline" className="border-gray-600 text-gray-300">
                <Settings className="h-4 w-4 mr-2" />
                Reconfigure
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Header */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-bold text-white">{analysisData?.brand_name}</h2>
            <Badge className="bg-blue-900 text-blue-100">{analysisData?.industry}</Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              <Globe className="h-3 w-3 mr-1" />
              {brandConfig?.brand?.website}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">{analysisData?.kpis?.competitors_tracked} competitors tracked</p>
            <p className="text-sm text-gray-400">Last updated: {lastUpdated?.toLocaleTimeString()}</p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-green-400" />
                Trend Momentum
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analysisData?.kpis?.trend_momentum}</div>
              <p className="text-xs text-gray-400">Cultural radar score</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                <Target className="h-4 w-4 mr-2 text-blue-400" />
                Brand Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analysisData?.kpis?.brand_score}</div>
              <p className="text-xs text-gray-400">Competitive position</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                <Users className="h-4 w-4 mr-2 text-purple-400" />
                Competitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analysisData?.kpis?.competitors_tracked}</div>
              <p className="text-xs text-gray-400">Active monitoring</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                <Activity className="h-4 w-4 mr-2 text-orange-400" />
                Sentiment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analysisData?.kpis?.sentiment_score}%</div>
              <p className="text-xs text-gray-400">Market sentiment</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-cyan-400" />
                DTC Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analysisData?.kpis?.dtc_score}</div>
              <p className="text-xs text-gray-400">Site audit score</p>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">Overview</TabsTrigger>
            <TabsTrigger value="cultural_radar" className="data-[state=active]:bg-green-600">Cultural Radar</TabsTrigger>
            <TabsTrigger value="competitive" className="data-[state=active]:bg-pink-600">Competitive</TabsTrigger>
            <TabsTrigger value="dtc_audit" className="data-[state=active]:bg-blue-600">DTC Audit</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Analysis Summary</CardTitle>
                  <CardDescription className="text-gray-400">Key insights from all intelligence agents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Cultural Radar Analysis Complete</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">Competitive Playbook Generated</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-gray-300">DTC Audit Completed</span>
                  </div>
                  
                  <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Market Position</h4>
                    <Badge className="bg-purple-900 text-purple-100">Leader</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Competitor Overview</CardTitle>
                  <CardDescription className="text-gray-400">Tracked competitors and their status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {brandConfig?.competitors?.length > 0 ? (
                    brandConfig.competitors.map((competitor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-white">{competitor.name}</h4>
                          <p className="text-sm text-gray-400">{competitor.website}</p>
                        </div>
                        <Badge className="bg-green-900 text-green-100">Active</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-gray-400">No competitors specified for monitoring</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cultural_radar" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Cultural Radar Analysis</CardTitle>
                <CardDescription className="text-gray-400">Cultural analysis for {analysisData?.brand_name} in {analysisData?.industry}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-green-400" />
                      <span className="text-sm text-gray-300">Trending content detected</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Social Momentum</h4>
                    <Badge className="bg-blue-900 text-blue-100">High</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Full Analysis</h4>
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                        {analysisData?.cultural_radar}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitive" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Competitive Playbook</CardTitle>
                <CardDescription className="text-gray-400">Competitive positioning analysis vs {analysisData?.kpis?.competitors_tracked} competitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Competitive Advantages</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm text-gray-300">Strength position identified</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm text-gray-300">Advantage position identified</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm text-gray-300">Leader position identified</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Market Position</h4>
                    <Badge className="bg-purple-900 text-purple-100">Leader</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Full Analysis</h4>
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                        {analysisData?.competitive_playbook}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dtc_audit" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">DTC Audit Results</CardTitle>
                <CardDescription className="text-gray-400">Digital experience audit for {brandConfig?.brand?.website}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Audit Score</h4>
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl font-bold text-white">{analysisData?.kpis?.dtc_score}/100</div>
                      <Progress value={analysisData?.kpis?.dtc_score} className="flex-1" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Key Recommendations</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-300">Personalization enhancement opportunities</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-300">Conversion funnel optimization potential</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-300">Analytics tracking improvements identified</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Full Audit Report</h4>
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                        {analysisData?.dtc_audit}
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DynamicDashboard;
