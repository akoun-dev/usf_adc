import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BarChart, PieChart, LineChart, Users, DollarSign, Target, CheckCircle } from 'lucide-react'

interface ProjectDashboardTabProps {
  project: any
}

export function ProjectDashboardTab({ project }: ProjectDashboardTabProps) {
  const { t } = useTranslation()
  
  // Calculate progress based on indicators
  const calculateProgress = () => {
    if (!project.indicators || !project.objectives) return 0
    
    // Simple calculation - in a real app, this would be based on actual indicator data
    const objectivesCount = project.objectives.split('\n').filter((o: string) => o.trim().length > 0).length
    const completedCount = Math.min(3, objectivesCount) // Simulate some progress
    
    return Math.round((completedCount / objectivesCount) * 100) || 0
  }

  const progress = calculateProgress()

  // Sample data for charts (in a real app, this would come from actual data)
  const budgetData = [
    { name: 'Utilisé', value: project.budget ? project.budget * 0.6 : 0 },
    { name: 'Restant', value: project.budget ? project.budget * 0.4 : 0 }
  ]

  const beneficiaryData = [
    { name: 'Femmes', value: 60 },
    { name: 'Hommes', value: 40 }
  ]

  const timelineData = [
    { month: 'Jan', value: 20 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 65 },
    { month: 'Apr', value: 80 },
    { month: 'May', value: 90 },
    { month: 'Jun', value: 95 }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('project.dashboard', 'Tableau de bord du projet')}</CardTitle>
        <CardDescription>{t('project.dashboardDesc', 'Suivi des indicateurs et performance')}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('project.budget', 'Budget')}</p>
                  <p className="text-2xl font-bold">{project.budget ? `${project.budget} €` : '0 €'}</p>
                </div>
                <DollarSign className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('project.beneficiaries', 'Bénéficiaires')}</p>
                  <p className="text-2xl font-bold">{project.beneficiaire || '0'}</p>
                </div>
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('project.progress', 'Progression')}</p>
                  <p className="text-2xl font-bold">{progress}%</p>
                </div>
                <Target className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('project.status', 'Statut')}</p>
                  <p className="text-2xl font-bold capitalize">{project.status}</p>
                </div>
                <CheckCircle className="h-6 w-6 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Section */}
        <div>
          <h3 className="font-semibold mb-4">{t('project.overallProgress', 'Progression globale')}</h3>
          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span>{progress}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <Tabs defaultValue="budget" className="space-y-4">
          <TabsList>
            <TabsTrigger value="budget">
              <BarChart className="h-4 w-4 mr-2" />
              {t('project.budgetDistribution', 'Budget')}
            </TabsTrigger>
            <TabsTrigger value="beneficiaries">
              <PieChart className="h-4 w-4 mr-2" />
              {t('project.beneficiariesDistribution', 'Bénéficiaires')}
            </TabsTrigger>
            <TabsTrigger value="timeline">
              <LineChart className="h-4 w-4 mr-2" />
              {t('project.timeline', 'Chronologie')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="budget">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">{t('project.budgetBreakdown', 'Répartition du budget')}</h4>
                <div className="space-y-4">
                  {budgetData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.name === 'Utilisé' ? '#3b82f6' : '#e5e7eb' }}></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value.toLocaleString()} €</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="beneficiaries">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">{t('project.beneficiariesBreakdown', 'Répartition des bénéficiaires')}</h4>
                <div className="space-y-4">
                  {beneficiaryData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.name === 'Femmes' ? '#ef4444' : '#3b82f6' }}></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-4">{t('project.progressTimeline', 'Chronologie de progression')}</h4>
                <div className="space-y-4">
                  <div className="flex items-end gap-4 h-40">
                    {timelineData.map((item) => (
                      <div key={item.month} className="flex flex-col items-center gap-1" style={{ height: `${item.value}%` }}>
                        <div className="bg-primary w-8 rounded-t" style={{ height: `${item.value}%` }}></div>
                        <span className="text-xs text-muted-foreground">{item.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Key Indicators */}
        <div>
          <h3 className="font-semibold mb-4">{t('project.keyIndicators', 'Indicateurs clés')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('project.completionRate', 'Taux d\'achèvement')}</p>
                    <p className="text-xl font-bold">{progress}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('project.remainingBudget', 'Budget restant')}</p>
                    <p className="text-xl font-bold">{project.budget ? `${project.budget * 0.4} €` : '0 €'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}