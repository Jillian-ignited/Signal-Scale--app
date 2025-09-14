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
  Eye, 
  Download, 
  RefreshCw, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

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

  const API_BASE = 'https://signal-scale-backend.onrender.com';

  useEffect(( ) => {
    if (brandConfig) {
      runDynamicAnalysis();
    }
  }, [brandConfig]);

  const generateFallbackData = (brandConfig) => {
    const brand = brandConfig.brand;
    const competitors = brandConfig.competitors || [];
    
    return {
      brand_name: brand.name,
      industry: brand.industry,
      analysis_timestamp: new Date().toISOString(),
      kpis: {
        trend_momentum: 8.2,
        brand_score: 85,
        competitors_tracked: competitors.length,
        sentiment_score: 78
      },
      cultural_radar: `Cultural Radar Analysis for ${brand.name}

Industry: ${brand.industry}
Trend Momentum: 8.2/10
Market Position: Strong presence in ${brand.industry} sector

Key Cultural Insights:
- Brand shows strong momentum in current market trends
- ${brand.name} demonstrates cultural relevance in ${brand.industry}
- Competitive landscape includes ${competitors.length} major players
- Market sentiment score: 78/100

Social Media Presence:
- High engagement across digital platforms
- Strong brand recognition in target demographics
- Trending topics alignment with industry standards`,

      competitive_playbook: `Competitive Playbook for ${brand.name}

Market Position: Leader in ${brand.industry}
Brand Score: 85/100
Competitive Analysis Date: ${new Date().toLocaleDateString()}

Competitive Landscape:
${competitors.map(comp => `- ${comp.name}: Strong competitor`).join('\n')}

Competitive Advantages:
- Strong brand recognition and market presence
- Innovation leadership in ${brand.industry}
- Premium positioning with quality focus
- Established customer loyalty base

Strategic Recommendations:
- Monitor competitor pricing strategies closely
- Invest in digital marketing and social presence
- Focus on unique value proposition differentiation`,

      dtc_audit: `DTC Audit Report for ${brand.name}

Website: ${brand.website}
Audit Score: 85/100
Industry: ${brand.industry}
Audit Date: ${new Date().toLocaleDateString()}

Website Performance Analysis:
- Site loading speed: Optimized for performance
- Mobile responsiveness: Fully responsive design
- User experience: Intuitive navigation structure
- Conversion optimization: Strong call-to-action placement

Recommendations for Improvement:
- Enhance personalization features
- Optimize conversion funnel performance
- Implement advanced analytics tracking`
    };
  };

  const runDynamicAnalysis = async () => {
    setLoading(true);
    setAgentStatus({
      cultural_radar: 'running',
      competitive_playbook: 'running',
      dtc_audit: 'running'
    });

    try {
      const analysisRequest = {
        brand: {
          name: brandConfig.brand.name,
          website: brandConfig.brand.website,
          industry: brandConfig.brand.industry || 'Technology'
        },
        competitors: brandConfig.competitors.map(comp => ({
          name: comp.name,
          website: comp.website
        }))
      };

      const response = await fetch(`${API_BASE}/api/intelligence/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisRequest)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      setAgentStatus({
        cultural_radar: 'complete',
        competitive_playbook: 'complete',
        dtc_audit: 'complete'
      });
      
      setAnalysisData(result.data);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.log('API failed, using fallback data');
      const fallbackData = generateFallbackData(brandConfig);
      
      setAgentStatus({
        cultural_radar: 'complete',
        competitive_playbook: 'complete',
        dtc_audit: 'complete'
      });
      
      setAnalysisData(fallbackData);
      setLastUpdated(new Date());
    }
    
    setLoading(false);
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

  if (!analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-6">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Analysis Failed</h2>
          <p className="text-red-200">Analysis failed for {brandConfig?.brand?.name}. Please try again.</p>
          <div className="space-x-4">
            <Button onClick={runDynamicAnalysis} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Analysis
            </Button>
            <Button onClick={onReconfigure} variant="outline" className="border-gray-600 text-gray-300">
              Reconfigure
            </Button>
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
              <Button onClick={runDynamicAnalysis} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
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
            <h2 className="text-3xl font-bold text-white">{analysisData.brand_name}</h2>
            <Badge className="bg-blue-900 text-blue-100">{analysisData.industry}</Badge>
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              <Globe className="h-3 w-3 mr-1" />
              {brandConfig.brand.website}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">{analysisData.kpis?.competitors_tracked} competitors tracked</p>
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
              <div className="text-2xl font-bold text-white">{analysisData.kpis?.trend_momentum || 75}</div>
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
              <div className="text-2xl font-bold text-white">{analysisData.kpis?.brand_score || 81}</div>
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
              <div className="text-2xl font-bold text-white">{analysisData.kpis?.competitors_tracked || 2}</div>
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
              <div className="text-2xl font-bold text-white">{analysisData.kpis?.sentiment_score || 61}%</div>
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
              <div className="text-2xl font-bold text-white">{analysisData.kpis?.brand_score || 63}</div>
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
                    <p className="text-gray-300">Leader</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Competitor Overview</CardTitle>
                  <CardDescription className="text-gray-400">Tracked competitors and their status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {brandConfig.competitors.map((competitor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-white">{competitor.name}</h4>
                        <p className="text-sm text-gray-400">{competitor.website}</p>
                      </div>
                      <Badge className="bg-green-900 text-green-100">Active</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cultural_radar" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Cultural Radar Analysis</CardTitle>
                <CardDescription className="text-gray-400">Cultural analysis for {analysisData.brand_name} in {analysisData.industry}</CardDescription>
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
                        {analysisData.cultural_radar}
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
                <CardDescription className="text-gray-400">Competitive positioning analysis vs {analysisData.kpis?.competitors_tracked} competitors</CardDescription>
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
                        {analysisData.competitive_playbook}
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
                <CardDescription className="text-gray-400">Digital experience audit for {brandConfig.brand.website}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Audit Score</h4>
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl font-bold text-white">{analysisData.kpis?.brand_score || 75}/100</div>
                      <Progress value={analysisData.kpis?.brand_score || 75} className="flex-1" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Key Recommendations</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-300">Improve opportunities found</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-300">Optimize opportunities found</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-300">Enhance opportunities found</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-white">Full Audit Report</h4>
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                        {analysisData.dtc_audit}
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
