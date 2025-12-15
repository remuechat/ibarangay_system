'use client'

import { useEffect, useState } from 'react'
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useResidents } from '@/hooks/use-Residents'

interface Resident {
  residentId: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  birthDate?: string;
  sex?: "Male" | "Female";
  civilStatus?: string;
  residentType?: string;
  houseNumber: string;
  street: string;
  city: string;
  purok: string;
  province?: string;
  contactNumber?: string;
  email?: string;
  familyId?: string;
  vulnerableTypes?: string[];
  status: "Active" | "Inactive" | "Transferred Out" | "Deceased";
  qrCode?: string;
  dateRegistered?: string;
  dateUpdated?: string;
}

export default function Dashboard() {
  const { residents, refresh } = useResidents()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      refresh();
      const data = await residents;
    } catch (error) {
      console.error('Error fetching residents:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = calculateStats(residents)

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Overview of barangay population and statistics</p>
      </div>

      {/* POPULATION OVERVIEW CARDS */}
      <div>
        <h2 className="text-xl font-semibold mb-4 px-4 lg:px-6">Population Overview</h2>
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Total Population</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.totalPopulation.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconTrendingUp />
                  Active
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                All active residents <IconTrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Total registered population
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Total Families</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.totalFamilies.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconTrendingUp />
                  Households
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Unique family groups <IconTrendingUp className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Registered households
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Local Residents</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.localResidents.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {stats.localPercentage}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {stats.localPercentage}% of population
              </div>
              <div className="text-muted-foreground">
                Native to this barangay
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Non-Local Residents</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.nonLocalResidents.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {stats.nonLocalPercentage}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {stats.nonLocalPercentage}% of population
              </div>
              <div className="text-muted-foreground">
                From other locations
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* VULNERABLE & SPECIAL CATEGORIES */}
      <div>
        <h2 className="text-xl font-semibold mb-4 px-4 lg:px-6">Vulnerable & Special Categories</h2>
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Senior Citizens</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.vulnerableBreakdown.seniorCitizen.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {((stats.vulnerableBreakdown.seniorCitizen / stats.totalPopulation) * 100).toFixed(1)}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                60 years old and above
              </div>
              <div className="text-muted-foreground">
                Registered senior citizens
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Solo Parents</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.vulnerableBreakdown.soloParent.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {((stats.vulnerableBreakdown.soloParent / stats.totalPopulation) * 100).toFixed(1)}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Single parent households
              </div>
              <div className="text-muted-foreground">
                Registered solo parents
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>PWD</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.vulnerableBreakdown.pwd.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  {((stats.vulnerableBreakdown.pwd / stats.totalPopulation) * 100).toFixed(1)}%
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Persons with disabilities
              </div>
              <div className="text-muted-foreground">
                Registered PWD
              </div>
            </CardFooter>
          </Card>

          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Total Vulnerable</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stats.totalVulnerable.toLocaleString()}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <IconTrendingUp />
                  All Categories
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                Combined vulnerable groups
              </div>
              <div className="text-muted-foreground">
                All special categories
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* POPULATION PER PUROK */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-4 lg:mx-6">
        <h2 className="text-xl font-semibold mb-4">Population Distribution per Purok</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stats.populationPerPurok.map((purok) => (
            <div key={purok.name} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-600 font-medium">Purok {purok.name}</p>
              <p className="text-3xl font-bold mt-2">{purok.value}</p>
              <p className="text-xs text-gray-500 mt-1">residents</p>
            </div>
          ))}
        </div>
      </div>

      {/* TRANSFER OUT TRENDS */}
      {stats.transferOutByYear.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-4 lg:mx-6">
          <h2 className="text-xl font-semibold mb-4">Transfer Out Trends by Year</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {stats.transferOutByYear.map((year) => (
              <div key={year.name} className="border rounded-lg p-4 min-w-[140px] hover:shadow-md transition-shadow">
                <p className="text-sm text-gray-600 font-medium">Year {year.name}</p>
                <p className="text-3xl font-bold mt-2">{year.value}</p>
                <p className="text-xs text-gray-500 mt-1">transferred out</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAILED PUROK STATISTICS TABLE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-4 lg:mx-6">
        <h2 className="text-xl font-semibold mb-4">Detailed Purok Statistics</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Purok</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Population</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Families</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Senior Citizens</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">PWD</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {stats.purokDetails.map((row, index) => (
                <tr key={row.purok} className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-4 py-3 font-medium">{row.purok}</td>
                  <td className="px-4 py-3">{row.population}</td>
                  <td className="px-4 py-3">{row.families}</td>
                  <td className="px-4 py-3">{row.seniors}</td>
                  <td className="px-4 py-3">{row.pwd}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{row.percentage}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VULNERABLE CATEGORY BREAKDOWN TABLE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-4 lg:mx-6">
        <h2 className="text-xl font-semibold mb-4">Vulnerable Category Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Count</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {stats.vulnerableTable.map((row, index) => (
                <tr key={row.category} className={`border-t hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="px-4 py-3 font-medium">{row.category}</td>
                  <td className="px-4 py-3">{row.count}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{row.percentage}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function calculateStats(residents: Resident[]) {
  const activeResidents = residents.filter(r => r.status === 'Active')
  const totalPopulation = activeResidents.length
  const residentsWithFamily = activeResidents.filter(r => r.familyId)
  const uniqueFamilies = new Set(residentsWithFamily.map(r => r.familyId))
  const totalFamilies = uniqueFamilies.size
  const localResidents = activeResidents.filter(r => r.residentType === 'Local' || r.residentType === 'local').length
  const nonLocalResidents = activeResidents.filter(r => r.residentType !== 'Local' && r.residentType !== 'local').length
  const localPercentage = totalPopulation > 0 ? ((localResidents / totalPopulation) * 100).toFixed(1) : '0.0'
  const nonLocalPercentage = totalPopulation > 0 ? ((nonLocalResidents / totalPopulation) * 100).toFixed(1) : '0.0'

  const vulnerableBreakdown = {
    seniorCitizen: activeResidents.filter(r => r.vulnerableTypes?.includes('Senior Citizen')).length,
    soloParent: activeResidents.filter(r => r.vulnerableTypes?.includes('Solo Parent')).length,
    pwd: activeResidents.filter(r => r.vulnerableTypes?.includes('PWD')).length,
    indigent: activeResidents.filter(r => r.vulnerableTypes?.includes('Indigent')).length,
    other: 0
  }
  
  const knownTypes = ['Senior Citizen', 'Solo Parent', 'PWD', 'Indigent']
  vulnerableBreakdown.other = activeResidents.filter(r => 
    r.vulnerableTypes?.some(type => !knownTypes.includes(type))
  ).length

  const totalVulnerable = activeResidents.filter(r => r.vulnerableTypes && r.vulnerableTypes.length > 0).length

  const purokGroups = activeResidents.reduce((acc, r) => {
    const purok = r.purok || 'Unknown'
    acc[purok] = (acc[purok] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const purokNames = Object.keys(purokGroups).sort()
  const populationPerPurok = purokNames.map(name => ({ name, value: purokGroups[name] }))

  const transferredOut = residents.filter(r => r.status === 'Transferred Out' && r.dateUpdated)
  const transferByYear = transferredOut.reduce((acc, r) => {
    const year = new Date(r.dateUpdated!).getFullYear().toString()
    acc[year] = (acc[year] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  const years = Object.keys(transferByYear).sort()
  const transferOutByYear = years.map(year => ({ name: year, value: transferByYear[year] }))

  const purokDetails = purokNames.map(purok => {
    const purokResidents = activeResidents.filter(r => r.purok === purok)
    const purokFamilies = new Set(purokResidents.filter(r => r.familyId).map(r => r.familyId)).size
    const seniors = purokResidents.filter(r => r.vulnerableTypes?.includes('Senior Citizen')).length
    const pwd = purokResidents.filter(r => r.vulnerableTypes?.includes('PWD')).length
    const population = purokResidents.length
    
    return {
      purok,
      population,
      families: purokFamilies,
      seniors,
      pwd,
      percentage: totalPopulation > 0 ? `${((population / totalPopulation) * 100).toFixed(1)}%` : '0%'
    }
  })

  const vulnerableTable = [
    {
      category: 'Senior Citizen',
      count: vulnerableBreakdown.seniorCitizen,
      percentage: totalPopulation > 0 ? `${((vulnerableBreakdown.seniorCitizen / totalPopulation) * 100).toFixed(1)}%` : '0%'
    },
    {
      category: 'Solo Parent',
      count: vulnerableBreakdown.soloParent,
      percentage: totalPopulation > 0 ? `${((vulnerableBreakdown.soloParent / totalPopulation) * 100).toFixed(1)}%` : '0%'
    },
    {
      category: 'PWD',
      count: vulnerableBreakdown.pwd,
      percentage: totalPopulation > 0 ? `${((vulnerableBreakdown.pwd / totalPopulation) * 100).toFixed(1)}%` : '0%'
    },
    {
      category: 'Indigent',
      count: vulnerableBreakdown.indigent,
      percentage: totalPopulation > 0 ? `${((vulnerableBreakdown.indigent / totalPopulation) * 100).toFixed(1)}%` : '0%'
    },
    {
      category: 'Other',
      count: vulnerableBreakdown.other,
      percentage: totalPopulation > 0 ? `${((vulnerableBreakdown.other / totalPopulation) * 100).toFixed(1)}%` : '0%'
    }
  ]

  return {
    totalPopulation,
    totalFamilies,
    localResidents,
    nonLocalResidents,
    localPercentage,
    nonLocalPercentage,
    vulnerableBreakdown,
    totalVulnerable,
    populationPerPurok,
    purokNames,
    transferOutByYear,
    years,
    purokDetails,
    vulnerableTable
  }
}