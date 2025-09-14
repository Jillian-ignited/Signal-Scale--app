import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Building2, Globe, Target, Users } from 'lucide-react';

const BrandSetup = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [brandData, setBrandData] = useState({
    name: '',
    website: '',
    industry: '',
    description: '',
    target_audience: ''
  });
  const [competitors, setCompetitors] = useState([]);
  const [competitorInput, setCompetitorInput] = useState('');

  const industries = [
    'Technology',
    'Athletic Wear',
    'Streetwear',
    'Fashion & Apparel',
    'Beauty & Cosmetics',
    'Luxury Fashion',
    'Automotive',
    'Food & Beverage',
    'Healthcare',
    'Financial Services',
    'E-commerce',
    'Gaming'
  ];

  const targetAudiences = [
    'Young Professionals (25-40)',
    'Gen Z Consumers (16-26)',
    'Millennials (27-42)',
    'Athletes & Fitness Enthusiasts (16-45)',
    'Streetwear Enthusiasts (16-35)',
    'Gamers (13-35)',
    'Luxury Consumers (30-55)',
    'Tech Early Adopters (18-35)',
    'Fashion Forward (18-35)',
    'Health & Wellness Focused (25-50)',
    'Business Decision Makers (30-60)',
    'Parents & Families (25-50)'
  ];

  const addCompetitor = () => {
    if (!competitorInput.trim() || competitors.length >= 10) return;
    
    // Clean up the website URL
    let website = competitorInput.trim();
    if (!website.startsWith('http://') && !website.startsWith('https://')) {
      if (!website.includes('.')) {
        website = `${website}.com`;
      }
      website = `https://${website}`;
    }

    const newCompetitor = {
      name: competitorInput.trim(),
      website: website
    };

    if (!competitors.find(c => c.name.toLowerCase() === newCompetitor.name.toLowerCase())) {
      setCompetitors(prev => [...prev, newCompetitor]);
      setCompetitorInput('');
    }
  };

  const removeCompetitor = (index) => {
    setCompetitors(prev => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (step === 1) {
      if (!brandData.name || !brandData.website || !brandData.industry) {
        alert('Please fill in all required fields');
        return;
      }
      setStep(2);
    } else {
      // Complete setup and pass data to parent
      const setupData = {
        brand: brandData,
        competitors: competitors
      };
      onComplete(setupData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Signal & Scale</h1>
          <p className="text-slate-300 text-lg">Competitive Intelligence Platform</p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-600 text-slate-300'
            }`}>
              <Building2 className="h-5 w-5" />
            </div>
            <div className={`h-1 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-600'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-600 text-slate-300'
            }`}>
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>

        {step === 1 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Setup Your Brand
              </CardTitle>
              <CardDescription className="text-slate-300">
                Tell us about your brand to get personalized competitive analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="brandName" className="text-white">Brand Name *</Label>
                  <Input
                    id="brandName"
                    value={brandData.name}
                    onChange={(e) => setBrandData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Nike"
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="website" className="text-white">Website URL *</Label>
                  <Input
                    id="website"
                    value={brandData.website}
                    onChange={(e) => setBrandData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="e.g., nike.com"
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="industry" className="text-white">Industry *</Label>
                <Select onValueChange={(value) => setBrandData(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-2">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry} className="text-white">
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description" className="text-white">Brand Description</Label>
                <Textarea
                  id="description"
                  value={brandData.description}
                  onChange={(e) => setBrandData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of your brand, products, and positioning..."
                  className="bg-slate-700 border-slate-600 text-white mt-2"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="targetAudience" className="text-white">Target Audience</Label>
                <Select onValueChange={(value) => setBrandData(prev => ({ ...prev, target_audience: value }))}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-2">
                    <SelectValue placeholder="Select your target audience" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {targetAudiences.map((audience) => (
                      <SelectItem key={audience} value={audience} className="text-white">
                        {audience}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleContinue}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!brandData.name || !brandData.website || !brandData.industry}
              >
                Continue to Competitor Selection
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Add Competitors
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Add up to 10 competitors to track and analyze (enter company names or websites)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Input
                    value={competitorInput}
                    onChange={(e) => setCompetitorInput(e.target.value)}
                    placeholder="Enter competitor name or website..."
                    className="bg-slate-700 border-slate-600 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && addCompetitor()}
                  />
                  <Button 
                    onClick={addCompetitor}
                    disabled={!competitorInput.trim() || competitors.length >= 10}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {competitors.length >= 10 && (
                  <p className="text-amber-400 text-sm mb-4">Maximum of 10 competitors reached</p>
                )}
              </CardContent>
            </Card>

            {/* Selected Competitors */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  Selected Competitors ({competitors.length}/10)
                  <Badge variant="outline" className="text-slate-300 border-slate-600">
                    {competitors.length} selected
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {competitors.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">
                    No competitors added yet. Add at least one competitor to continue.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {competitors.map((competitor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Globe className="h-4 w-4 text-blue-400" />
                          <div>
                            <p className="text-white font-medium">{competitor.name}</p>
                            <p className="text-slate-400 text-sm">{competitor.website}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => removeCompetitor(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <Button 
                  onClick={handleContinue}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white"
                  disabled={competitors.length === 0}
                >
                  Complete Setup & Start Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandSetup;

