import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const Dashboard = ({ brandConfig, onReconfigure }) => {
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState(null);

  const API_BASE = 'https://signal-scale.onrender.com';

  useEffect(() => {
    if (brandConfig) {
      runAnalysis();
    }
  }, [brandConfig]);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      // Prepare the analysis request format for your API
      const analysisRequest = {
        brand: {
          name: brandConfig.brand.name,
          website: brandConfig.brand.website,
          industry: brandConfig.brand.industry,
          description: brandConfig.brand.description || '',
          target_audience: brandConfig.brand.target_audience || ''
        },
        competitors: brandConfig.competitors.map(comp => ({
          name: comp.name,
          website: comp.website
        }))
      };

      // Run all three agents in parallel
      const [culturalRadarResponse, competitivePlaybookResponse, dtcAuditResponse] = await Promise.all([
        fetch(`${API_BASE}/api/run/cultural_radar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(analysisRequest)
        }),
        fetch(`${API_BASE}/api/run/competitive_playbook`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(analysisRequest)
        }),
        fetch(`${API_BASE}/api/run/dtc_audit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(analysisRequest)
        })
      ]);

      const culturalRadarData = await culturalRadarResponse.json();
      const competitivePlaybookData = await competitivePlaybookResponse.json();
      const dtcAuditData = await dtcAuditResponse.json();

      // Combine all agent results
      const combinedData = {
        cultural_radar: culturalRadarData,
        competitive_playbook: competitivePlaybookData,
        dtc_audit: dtcAuditData,
        timestamp: new Date().toISOString()
      };

      setAnalysisData(combinedData);
      setLastUpdated(new Date());
      
    } catch (error) {
      console.error('Analysis failed:', error);
      // Show error state but don't break the UI
      setAnalysisData({
        error: 'Analysis failed. Please try again.',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    if (!analysisData) return;
    
    try {
      const exportRequest = {
        brand: brandConfig.brand,
        competitors: brandConfig.competitors,
        analysis_data: analysisData,
        format: 'pdf'
      };

      const response = await fetch(`${API_BASE}/api/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exportRequest)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${brandConfig.brand.name}_competitive_intelligence_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-white mb-2">Running Competitive Analysis</h2>
          <p className="text-slate-300">Analyzing {brandConfig?.brand?.name} vs {brandConfig?.competitors?.length || 0} competitors...</p>
          <div className="mt-4 space-y-2 text-sm text-slate-400">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              Cultural Radar Agent
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              Competitive Playbook Agent
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" />
              DTC Audit Agent
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (analysisData?.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Analysis Failed</h2>
          <p className="text-slate-300 mb-4">{analysisData.error}</p>
          <div className="space-x-4">
            <Button onClick={runAnalysis} className="bg-blue-600 hover:bg-blue-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Analysis
            </Button>
            <Button onClick={onReconfigure} variant="outline" className="border-slate-600 text-slate-300">
              <Settings className="h-4 w-4 mr-2" />
              Reconfigure
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Extract key metrics from agent responses
  const getKPIData = () => {
    if (!analysisData) return null;

    // Extract metrics from your agent responses
    const culturalData = analysisData.cultural_radar;
    const competitiveData = analysisData.competitive_playbook;
    const auditData = analysisData.dtc_audit;

    return {
      trendMomentum: culturalData?.trend_momentum || 0,
      brandScore: competitiveData?.brand_score || 0,
      competitorsTracked: brandConfig.competitors.length,
      sentimentScore: culturalData?.sentiment_score || 0,
      auditScore: auditData?.overall_score || 0
    };
  };

  const kpiData = getKPIData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Signal & Scale</h1>
              <p className="text-slate-300">Competitive Intelligence Platform</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={runAnalysis}
                disabled={loading}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={exportReport}
                disabled={!analysisData || loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Button
                onClick={onReconfigure}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Settings className="h-4 w-4 mr-2" />
                Reconfigure
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Info */}
      <div className="container mx-auto px-6 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">{brandConfig.brand.name}</h2>
          <div className="flex items-center gap-4 flex-wrap">
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              {brandConfig.brand.industry}
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400">
              {brandConfig.brand.website}
            </Badge>
            <span className="text-slate-400">
              {brandConfig.competitors.length} competitors tracked
            </span>
            {lastUpdated && (
              <span className="text-slate-500 text-sm">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        {kpiData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Trend Momentum</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{kpiData.trendMomentum}</div>
                <p className="text-xs text-slate-400">Cultural radar score</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Brand Score</CardTitle>
                <Target className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{kpiData.brandScore}</div>
                <p className="text-xs text-slate-400">Competitive position</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Competitors</CardTitle>
                <Users className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{kpiData.competitorsTracked}</div>
                <p className="text-xs text-slate-400">Active monitoring</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">Sentiment</CardTitle>
                <Activity className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{kpiData.sentimentScore}%</div>
                <p className="text-xs text-slate-400">Market sentiment</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">DTC Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-cyan-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{kpiData.auditScore}</div>
                <p className="text-xs text-slate-400">Site audit score</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analysis Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="overview" className="text-slate-300 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="cultural" className="text-slate-300 data-[state=active]:text-white">
              Cultural Radar
            </TabsTrigger>
            <TabsTrigger value="competitive" className="text-slate-300 data-[state=active]:text-white">
              Competitive
            </TabsTrigger>
            <TabsTrigger value="audit" className="text-slate-300 data-[state=active]:text-white">
              DTC Audit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Analysis Summary</CardTitle>
                  <CardDescription className="text-slate-400">
                    Key insights from all intelligence agents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-white">Cultural Radar Analysis Complete</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-white">Competitive Playbook Generated</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-white">DTC Audit Completed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Competitor Overview</CardTitle>
                  <CardDescription className="text-slate-400">
                    Tracked competitors and their status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {brandConfig.competitors.slice(0, 5).map((competitor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{competitor.name}</p>
                          <p className="text-slate-400 text-sm">{competitor.website}</p>
                        </div>
                        <Badge variant="outline" className="border-green-500 text-green-400">
                          Active
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cultural" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Cultural Radar Analysis</CardTitle>
                <CardDescription className="text-slate-400">
                  Social media trends, sentiment, and cultural momentum
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisData?.cultural_radar ? (
                  <div className="space-y-4">
                    <pre className="text-slate-300 text-sm bg-slate-900 p-4 rounded-lg overflow-auto">
                      {JSON.stringify(analysisData.cultural_radar, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-slate-400">Cultural radar data not available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitive" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Competitive Playbook</CardTitle>
                <CardDescription className="text-slate-400">
                  Competitive positioning, benchmarks, and strategic insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisData?.competitive_playbook ? (
                  <div className="space-y-4">
                    <pre className="text-slate-300 text-sm bg-slate-900 p-4 rounded-lg overflow-auto">
                      {JSON.stringify(analysisData.competitive_playbook, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-slate-400">Competitive playbook data not available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">DTC Audit Results</CardTitle>
                <CardDescription className="text-slate-400">
                  Website UX, checkout, content, and mobile experience analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisData?.dtc_audit ? (
                  <div className="space-y-4">
                    <pre className="text-slate-300 text-sm bg-slate-900 p-4 rounded-lg overflow-auto">
                      {JSON.stringify(analysisData.dtc_audit, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p className="text-slate-400">DTC audit data not available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;

