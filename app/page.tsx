'use client'

import { useState } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2, X, Heart, Users, MapPin, Calendar, CheckCircle, Share2, ChevronLeft, ChevronRight, Home as HomeIcon, Search, Bookmark, User, Send, TrendingUp, Award, Activity } from 'lucide-react'

// TypeScript interfaces from actual agent response
interface RecommendedNGO {
  ngo_name: string
  cause_area: string
  match_reason: string
}

interface AgentResponse {
  status: string
  result: {
    message: string
    recommended_ngos: RecommendedNGO[]
    conversation_stage: string
  }
  metadata?: {
    agent_name: string
    timestamp: string
  }
}

// Extended NGO interface for full profile data
interface NGO {
  id: string
  name: string
  logo: string
  banner_image: string
  cause_areas: string[]
  mission: string
  impact_stats: {
    patients_helped: number
    areas_served: number
    years_active: number
  }
  funding: {
    goal: number
    current: number
    allocation: {
      medical_supplies: number
      staff: number
      infrastructure: number
    }
  }
  patient_stories: {
    id: string
    image: string
    name: string
    story: string
    age: number
  }[]
  field_updates: {
    id: string
    date: string
    title: string
    description: string
  }[]
  location: {
    state: string
    city: string
  }
  verified: boolean
}

// Mock NGO data for initial display
const MOCK_NGOS: NGO[] = [
  {
    id: '1',
    name: 'Save the Children India',
    logo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&h=200&fit=crop',
    banner_image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=400&fit=crop',
    cause_areas: ['Child Health', 'Nutrition', 'Immunization'],
    mission: 'Promoting child health through comprehensive nutrition and healthcare programs across India, ensuring every child has access to quality medical care.',
    impact_stats: {
      patients_helped: 250000,
      areas_served: 18,
      years_active: 15
    },
    funding: {
      goal: 10000000,
      current: 7500000,
      allocation: {
        medical_supplies: 45,
        staff: 35,
        infrastructure: 20
      }
    },
    patient_stories: [
      {
        id: 's1',
        image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=400&fit=crop',
        name: 'Ananya',
        story: 'Thanks to the nutrition program, Ananya recovered from malnutrition and is now a healthy, energetic 5-year-old.',
        age: 5
      },
      {
        id: 's2',
        image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&h=400&fit=crop',
        name: 'Rohan',
        story: 'The immunization drive saved Rohan from preventable diseases, giving him a chance at a healthy future.',
        age: 3
      }
    ],
    field_updates: [
      {
        id: 'u1',
        date: '2026-01-28',
        title: 'Mobile Health Camp in Rural Bihar',
        description: 'Conducted health screenings for 500+ children, providing free medicines and nutrition supplements.'
      },
      {
        id: 'u2',
        date: '2026-01-15',
        title: 'New Immunization Center Opened',
        description: 'Launched a new center in Jharkhand to improve vaccine access for remote communities.'
      }
    ],
    location: {
      state: 'Pan India',
      city: 'Multiple Cities'
    },
    verified: true
  },
  {
    id: '2',
    name: 'CRY - Child Rights and You',
    logo: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=200&h=200&fit=crop',
    banner_image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&h=400&fit=crop',
    cause_areas: ['Child Health', 'Education', 'Malnutrition'],
    mission: 'Ensuring access to healthcare for children and reducing malnutrition through community-based programs in underserved areas.',
    impact_stats: {
      patients_helped: 180000,
      areas_served: 22,
      years_active: 12
    },
    funding: {
      goal: 8000000,
      current: 6200000,
      allocation: {
        medical_supplies: 50,
        staff: 30,
        infrastructure: 20
      }
    },
    patient_stories: [
      {
        id: 's3',
        image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600&h=400&fit=crop',
        name: 'Priya',
        story: 'CRY provided Priya with critical healthcare support during her recovery from tuberculosis.',
        age: 7
      }
    ],
    field_updates: [
      {
        id: 'u3',
        date: '2026-02-01',
        title: 'Nutrition Awareness Workshop',
        description: 'Trained 200 mothers on balanced diets and health practices for children under 5.'
      }
    ],
    location: {
      state: 'Maharashtra',
      city: 'Mumbai'
    },
    verified: true
  },
  {
    id: '3',
    name: 'Smile Foundation',
    logo: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=200&h=200&fit=crop',
    banner_image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&h=400&fit=crop',
    cause_areas: ['Maternal Health', 'Child Health', 'Rural Healthcare'],
    mission: 'Bringing quality healthcare to rural communities with a focus on maternal and child health services.',
    impact_stats: {
      patients_helped: 95000,
      areas_served: 14,
      years_active: 8
    },
    funding: {
      goal: 5000000,
      current: 3800000,
      allocation: {
        medical_supplies: 40,
        staff: 40,
        infrastructure: 20
      }
    },
    patient_stories: [
      {
        id: 's4',
        image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600&h=400&fit=crop',
        name: 'Lakshmi',
        story: 'Safe delivery and postnatal care ensured both Lakshmi and her baby are healthy and thriving.',
        age: 28
      }
    ],
    field_updates: [
      {
        id: 'u4',
        date: '2026-01-20',
        title: 'Maternal Health Camp',
        description: 'Free prenatal checkups and care packages distributed to 300+ expecting mothers.'
      }
    ],
    location: {
      state: 'Rajasthan',
      city: 'Jaipur'
    },
    verified: true
  },
  {
    id: '4',
    name: 'Indian Cancer Society',
    logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=200&fit=crop',
    banner_image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=400&fit=crop',
    cause_areas: ['Cancer Care', 'Palliative Care', 'Patient Support'],
    mission: 'Providing comprehensive cancer care, treatment support, and palliative services to patients across India.',
    impact_stats: {
      patients_helped: 42000,
      areas_served: 10,
      years_active: 20
    },
    funding: {
      goal: 12000000,
      current: 9100000,
      allocation: {
        medical_supplies: 55,
        staff: 25,
        infrastructure: 20
      }
    },
    patient_stories: [
      {
        id: 's5',
        image: 'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&h=400&fit=crop',
        name: 'Rajesh',
        story: 'With subsidized treatment and emotional support, Rajesh successfully completed his cancer therapy.',
        age: 45
      }
    ],
    field_updates: [
      {
        id: 'u5',
        date: '2026-01-25',
        title: 'Free Cancer Screening Camp',
        description: 'Conducted screenings for 400+ people, with early detection saving lives.'
      }
    ],
    location: {
      state: 'Delhi',
      city: 'New Delhi'
    },
    verified: true
  },
  {
    id: '5',
    name: 'Mind India Foundation',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    banner_image: 'https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?w=800&h=400&fit=crop',
    cause_areas: ['Mental Health', 'Counseling', 'Awareness'],
    mission: 'Breaking stigma and providing accessible mental health services through counseling and community programs.',
    impact_stats: {
      patients_helped: 68000,
      areas_served: 16,
      years_active: 6
    },
    funding: {
      goal: 4000000,
      current: 2900000,
      allocation: {
        medical_supplies: 20,
        staff: 60,
        infrastructure: 20
      }
    },
    patient_stories: [
      {
        id: 's6',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=400&fit=crop',
        name: 'Meera',
        story: 'Through regular counseling sessions, Meera overcame depression and regained her joy for life.',
        age: 32
      }
    ],
    field_updates: [
      {
        id: 'u6',
        date: '2026-02-03',
        title: 'Mental Health Awareness Week',
        description: 'Reached 5000+ people through workshops and free counseling sessions.'
      }
    ],
    location: {
      state: 'Karnataka',
      city: 'Bangalore'
    },
    verified: true
  },
  {
    id: '6',
    name: 'Disability Rights Foundation',
    logo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    banner_image: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=800&h=400&fit=crop',
    cause_areas: ['Disabilities', 'Rehabilitation', 'Assistive Devices'],
    mission: 'Empowering persons with disabilities through healthcare, rehabilitation, and assistive technology access.',
    impact_stats: {
      patients_helped: 35000,
      areas_served: 12,
      years_active: 10
    },
    funding: {
      goal: 6000000,
      current: 4500000,
      allocation: {
        medical_supplies: 35,
        staff: 40,
        infrastructure: 25
      }
    },
    patient_stories: [
      {
        id: 's7',
        image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop',
        name: 'Arjun',
        story: 'Received a customized wheelchair and physiotherapy, enabling Arjun to pursue his education.',
        age: 14
      }
    ],
    field_updates: [
      {
        id: 'u7',
        date: '2026-01-18',
        title: 'Assistive Device Distribution',
        description: 'Distributed 150 wheelchairs and hearing aids to persons with disabilities.'
      }
    ],
    location: {
      state: 'West Bengal',
      city: 'Kolkata'
    },
    verified: true
  }
]

const AGENT_ID = '69859700e5d25ce3f598cbc8'

export default function Home() {
  const [activeScreen, setActiveScreen] = useState<'home' | 'explore' | 'saved' | 'profile'>('home')
  const [showDiscoveryChat, setShowDiscoveryChat] = useState(false)
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null)
  const [showVolunteerModal, setShowVolunteerModal] = useState(false)
  const [savedNGOs, setSavedNGOs] = useState<string[]>([])

  // Discovery chat state
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'agent', content: string, ngos?: RecommendedNGO[]}>>([])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Explore filters
  const [filterCause, setFilterCause] = useState<string>('All')
  const [filterLocation, setFilterLocation] = useState<string>('All')
  const [sortBy, setSortBy] = useState<string>('impact')

  // Volunteer form
  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    availability: '',
    skills: [] as string[]
  })
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false)

  // Patient story carousel
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return

    const message = userInput.trim()
    setUserInput('')

    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', content: message }])
    setIsLoading(true)

    try {
      const result = await callAIAgent(message, AGENT_ID)

      if (result.success) {
        const response = result.response as AgentResponse
        const agentMessage = response.result.message
        const recommendedNGOs = response.result.recommended_ngos || []

        setChatMessages(prev => [...prev, {
          role: 'agent',
          content: agentMessage,
          ngos: recommendedNGOs
        }])
      } else {
        setChatMessages(prev => [...prev, {
          role: 'agent',
          content: 'Sorry, I encountered an issue. Please try again.'
        }])
      }
    } catch (error) {
      setChatMessages(prev => [...prev, {
        role: 'agent',
        content: 'Sorry, something went wrong. Please try again.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickReply = async (reply: string) => {
    setUserInput(reply)
    // Trigger send with the quick reply
    setTimeout(() => {
      const btn = document.getElementById('send-btn')
      if (btn) btn.click()
    }, 100)
  }

  const startDiscoveryChat = () => {
    setShowDiscoveryChat(true)
    if (chatMessages.length === 0) {
      setChatMessages([{
        role: 'agent',
        content: 'Hello! I\'m here to help you find healthcare NGOs that match your interests. What healthcare cause are you most passionate about?'
      }])
    }
  }

  const toggleSaveNGO = (ngoId: string) => {
    setSavedNGOs(prev =>
      prev.includes(ngoId)
        ? prev.filter(id => id !== ngoId)
        : [...prev, ngoId]
    )
  }

  const handleVolunteerSubmit = () => {
    setVolunteerSubmitted(true)
    setTimeout(() => {
      setShowVolunteerModal(false)
      setVolunteerSubmitted(false)
      setVolunteerForm({
        name: '',
        email: '',
        phone: '',
        city: '',
        availability: '',
        skills: []
      })
    }, 2000)
  }

  const toggleSkill = (skill: string) => {
    setVolunteerForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const getFilteredNGOs = () => {
    let filtered = [...MOCK_NGOS]

    if (filterCause !== 'All') {
      filtered = filtered.filter(ngo => ngo.cause_areas.includes(filterCause))
    }

    if (filterLocation !== 'All') {
      filtered = filtered.filter(ngo => ngo.location.state === filterLocation || ngo.location.state === 'Pan India')
    }

    // Sort
    if (sortBy === 'impact') {
      filtered.sort((a, b) => b.impact_stats.patients_helped - a.impact_stats.patients_helped)
    } else if (sortBy === 'years') {
      filtered.sort((a, b) => b.impact_stats.years_active - a.impact_stats.years_active)
    }

    return filtered
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`
    return num.toString()
  }

  // NGO Card Component
  const NGOCard = ({ ngo, onClick }: { ngo: NGO, onClick: () => void }) => (
    <Card className="w-full hover:shadow-lg transition-shadow cursor-pointer group">
      <div onClick={onClick}>
        <div className="relative h-40 overflow-hidden rounded-t-lg">
          <img
            src={ngo.banner_image}
            alt={ngo.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-white rounded-full p-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleSaveNGO(ngo.id)
              }}
              className="hover:scale-110 transition-transform"
            >
              <Heart
                className={`w-5 h-5 ${savedNGOs.includes(ngo.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              />
            </button>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <img
              src={ngo.logo}
              alt={`${ngo.name} logo`}
              className="w-12 h-12 rounded-lg object-cover border-2 border-gray-100"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{ngo.name}</h3>
                {ngo.verified && (
                  <CheckCircle className="w-4 h-4 text-[#4A90D9]" />
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {ngo.cause_areas.slice(0, 2).map((cause, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-blue-50 text-[#4A90D9] px-2 py-1 rounded-full"
                  >
                    {cause}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {ngo.mission}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{formatNumber(ngo.impact_stats.patients_helped)} helped</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{ngo.location.city}</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )

  // Home Screen
  const HomeScreen = () => (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#4A90D9] to-[#357ABD] text-white px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Discover Healthcare NGOs That Match Your Heart
          </h1>
          <p className="text-lg mb-6 text-blue-50">
            Connect with verified organizations making a real difference in healthcare across India
          </p>
          <Button
            onClick={startDiscoveryChat}
            className="bg-[#E07A5F] hover:bg-[#D06A4F] text-white h-12 px-8 text-lg font-semibold"
          >
            Find NGOs for Me
          </Button>
        </div>
      </div>

      {/* Trust Banner */}
      <div className="bg-green-50 border-b border-green-100 py-3 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Only Verified NGOs - All organizations are thoroughly vetted
          </span>
        </div>
      </div>

      {/* Featured NGOs */}
      <div className="px-6 py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured NGOs</h2>
          <Button
            variant="ghost"
            onClick={() => setActiveScreen('explore')}
            className="text-[#4A90D9]"
          >
            View All
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_NGOS.slice(0, 6).map(ngo => (
            <NGOCard
              key={ngo.id}
              ngo={ngo}
              onClick={() => setSelectedNGO(ngo)}
            />
          ))}
        </div>
      </div>

      {/* Impact Stats */}
      <div className="bg-gray-50 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Collective Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-10 h-10 text-[#4A90D9] mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  650K+
                </div>
                <div className="text-sm text-gray-600">Patients Helped</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="w-10 h-10 text-[#4A90D9] mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  92
                </div>
                <div className="text-sm text-gray-600">Areas Served</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Award className="w-10 h-10 text-[#4A90D9] mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  6
                </div>
                <div className="text-sm text-gray-600">Verified NGOs</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )

  // Explore Screen
  const ExploreScreen = () => {
    const filteredNGOs = getFilteredNGOs()

    return (
      <div className="pb-20">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Explore NGOs</h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filterCause}
              onChange={(e) => setFilterCause(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
            >
              <option value="All">All Causes</option>
              <option value="Child Health">Child Health</option>
              <option value="Maternal Health">Maternal Health</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Cancer Care">Cancer Care</option>
              <option value="Rural Healthcare">Rural Healthcare</option>
              <option value="Disabilities">Disabilities</option>
            </select>

            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
            >
              <option value="All">All Locations</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Delhi">Delhi</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Rajasthan">Rajasthan</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
            >
              <option value="impact">Sort by Impact</option>
              <option value="years">Sort by Experience</option>
            </select>
          </div>
        </div>

        {/* NGO Grid */}
        <div className="px-6 py-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNGOs.map(ngo => (
              <NGOCard
                key={ngo.id}
                ngo={ngo}
                onClick={() => setSelectedNGO(ngo)}
              />
            ))}
          </div>
          {filteredNGOs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No NGOs found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Saved Screen
  const SavedScreen = () => {
    const savedNGOsList = MOCK_NGOS.filter(ngo => savedNGOs.includes(ngo.id))

    return (
      <div className="pb-20">
        <div className="bg-white border-b px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Saved NGOs</h1>
          <p className="text-sm text-gray-600 mt-1">
            {savedNGOsList.length} organization{savedNGOsList.length !== 1 ? 's' : ''} saved
          </p>
        </div>

        <div className="px-6 py-6 max-w-6xl mx-auto">
          {savedNGOsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedNGOsList.map(ngo => (
                <NGOCard
                  key={ngo.id}
                  ngo={ngo}
                  onClick={() => setSelectedNGO(ngo)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved NGOs yet</h3>
              <p className="text-gray-600 mb-4">Start exploring and save NGOs you're interested in</p>
              <Button
                onClick={() => setActiveScreen('explore')}
                className="bg-[#4A90D9] hover:bg-[#3A7AB9]"
              >
                Explore NGOs
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Profile Screen
  const ProfileScreen = () => (
    <div className="pb-20">
      <div className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      </div>

      <div className="px-6 py-6 max-w-2xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-[#4A90D9] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                U
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
                <p className="text-sm text-gray-600">Member since 2026</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Saved NGOs</span>
                </div>
                <span className="font-semibold text-[#4A90D9]">{savedNGOs.length}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Volunteer Applications</span>
                </div>
                <span className="font-semibold text-[#4A90D9]">0</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">NGOs Discovered</span>
                </div>
                <span className="font-semibold text-[#4A90D9]">{MOCK_NGOS.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={startDiscoveryChat}
              >
                <Search className="w-4 h-4 mr-2" />
                Discover More NGOs
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setActiveScreen('explore')}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Explore All Organizations
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // NGO Profile Screen
  const NGOProfileScreen = ({ ngo }: { ngo: NGO }) => {
    const fundingPercentage = (ngo.funding.current / ngo.funding.goal) * 100

    return (
      <div className="pb-20">
        {/* Back Button */}
        <div className="bg-white border-b px-6 py-3">
          <button
            onClick={() => setSelectedNGO(null)}
            className="flex items-center gap-2 text-[#4A90D9] hover:text-[#3A7AB9]"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>

        {/* Banner & Header */}
        <div className="relative">
          <img
            src={ngo.banner_image}
            alt={ngo.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <div className="max-w-4xl mx-auto flex items-end gap-4">
              <img
                src={ngo.logo}
                alt={`${ngo.name} logo`}
                className="w-24 h-24 rounded-lg border-4 border-white object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-white">{ngo.name}</h1>
                  {ngo.verified && (
                    <CheckCircle className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {ngo.cause_areas.map((cause, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-white/90 text-[#4A90D9] px-3 py-1 rounded-full font-medium"
                    >
                      {cause}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 max-w-4xl mx-auto space-y-8">
          {/* Mission */}
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{ngo.mission}</p>
            </CardContent>
          </Card>

          {/* Impact Stats */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Impact Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-[#4A90D9] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(ngo.impact_stats.patients_helped)}
                  </div>
                  <div className="text-sm text-gray-600">Patients Helped</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <MapPin className="w-8 h-8 text-[#4A90D9] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {ngo.impact_stats.areas_served}
                  </div>
                  <div className="text-sm text-gray-600">Areas Served</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-[#4A90D9] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {ngo.impact_stats.years_active}
                  </div>
                  <div className="text-sm text-gray-600">Years Active</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Funding Transparency */}
          <Card>
            <CardHeader>
              <CardTitle>Funding Transparency</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Funding Progress</span>
                  <span className="text-sm font-bold text-[#4A90D9]">
                    {fundingPercentage.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#4A90D9] h-3 rounded-full transition-all"
                    style={{ width: `${fundingPercentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-xs text-gray-600">
                  <span>₹{formatNumber(ngo.funding.current)}</span>
                  <span>₹{formatNumber(ngo.funding.goal)}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Fund Allocation</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">Medical Supplies</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {ngo.funding.allocation.medical_supplies}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${ngo.funding.allocation.medical_supplies}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">Staff & Training</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {ngo.funding.allocation.staff}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${ngo.funding.allocation.staff}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">Infrastructure</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {ngo.funding.allocation.infrastructure}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${ngo.funding.allocation.infrastructure}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Stories */}
          {ngo.patient_stories.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Stories</h2>
              <Card className="overflow-hidden">
                <div className="relative">
                  <img
                    src={ngo.patient_stories[currentStoryIndex].image}
                    alt={ngo.patient_stories[currentStoryIndex].name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {ngo.patient_stories[currentStoryIndex].name}, {ngo.patient_stories[currentStoryIndex].age}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {ngo.patient_stories[currentStoryIndex].story}
                    </p>
                  </div>

                  {ngo.patient_stories.length > 1 && (
                    <>
                      <button
                        onClick={() => setCurrentStoryIndex(prev => prev === 0 ? ngo.patient_stories.length - 1 : prev - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-900" />
                      </button>
                      <button
                        onClick={() => setCurrentStoryIndex(prev => prev === ngo.patient_stories.length - 1 ? 0 : prev + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-900" />
                      </button>
                    </>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Field Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Field Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ngo.field_updates.map(update => (
                  <div key={update.id} className="border-l-2 border-[#4A90D9] pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {new Date(update.date).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{update.title}</h4>
                    <p className="text-sm text-gray-600">{update.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fixed Action Bar */}
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t shadow-lg px-6 py-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Button
              className="flex-1 bg-[#E07A5F] hover:bg-[#D06A4F] text-white h-12 font-semibold"
            >
              Donate Now
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-12 font-semibold border-[#4A90D9] text-[#4A90D9] hover:bg-blue-50"
              onClick={() => setShowVolunteerModal(true)}
            >
              Volunteer
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 border-gray-300"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Discovery Chat Modal
  const DiscoveryChatModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Find Your Perfect NGO Match</h2>
          <button
            onClick={() => setShowDiscoveryChat(false)}
            className="hover:bg-gray-100 p-2 rounded-full"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Quick Reply Pills */}
        <div className="p-4 border-b bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">Quick replies:</p>
          <div className="flex flex-wrap gap-2">
            {['Maternal Health', 'Mental Health', 'Cancer Care', 'Rural Healthcare', 'Child Health', 'Disabilities'].map(cause => (
              <button
                key={cause}
                onClick={() => handleQuickReply(cause)}
                className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:border-[#4A90D9] hover:text-[#4A90D9] transition-colors"
              >
                {cause}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'bg-[#4A90D9] text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
                <p className="text-sm">{msg.content}</p>

                {/* Display recommended NGOs */}
                {msg.ngos && msg.ngos.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {msg.ngos.map((ngo, ngoIdx) => (
                      <div
                        key={ngoIdx}
                        className="bg-white rounded-lg p-3 text-gray-900 border border-gray-200"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-sm">{ngo.ngo_name}</h4>
                            <span className="text-xs text-[#4A90D9] bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                              {ngo.cause_area}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">{ngo.match_reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3">
                <Loader2 className="w-5 h-5 animate-spin text-[#4A90D9]" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              id="send-btn"
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isLoading}
              className="bg-[#4A90D9] hover:bg-[#3A7AB9]"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  // Volunteer Modal
  const VolunteerModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white rounded-t-lg md:rounded-lg w-full md:max-w-lg md:max-h-[90vh] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Volunteer Signup</h2>
          <button
            onClick={() => setShowVolunteerModal(false)}
            className="hover:bg-gray-100 p-2 rounded-full"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          {!volunteerSubmitted ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  value={volunteerForm.name}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  type="email"
                  value={volunteerForm.email}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={volunteerForm.phone}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <Input
                  value={volunteerForm.city}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, city: e.target.value }))}
                  placeholder="Your city"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  value={volunteerForm.availability}
                  onChange={(e) => setVolunteerForm(prev => ({ ...prev, availability: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90D9]"
                >
                  <option value="">Select availability</option>
                  <option value="weekends">Weekends</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills & Interests
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Medical', 'Teaching', 'Fundraising', 'Social Media', 'Event Planning', 'Counseling', 'Administrative'].map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        volunteerForm.skills.includes(skill)
                          ? 'bg-[#4A90D9] text-white border-[#4A90D9]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#4A90D9]'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleVolunteerSubmit}
                disabled={!volunteerForm.name || !volunteerForm.email || !volunteerForm.phone}
                className="w-full bg-[#E07A5F] hover:bg-[#D06A4F] text-white h-12 font-semibold"
              >
                Sign Up to Volunteer
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">
                We've received your volunteer application. Someone from the NGO will contact you soon.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // Bottom Navigation
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg px-6 py-3 z-40">
      <div className="max-w-4xl mx-auto flex items-center justify-around">
        <button
          onClick={() => setActiveScreen('home')}
          className={`flex flex-col items-center gap-1 ${activeScreen === 'home' ? 'text-[#4A90D9]' : 'text-gray-500'}`}
        >
          <HomeIcon className="w-6 h-6" />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button
          onClick={() => setActiveScreen('explore')}
          className={`flex flex-col items-center gap-1 ${activeScreen === 'explore' ? 'text-[#4A90D9]' : 'text-gray-500'}`}
        >
          <Search className="w-6 h-6" />
          <span className="text-xs font-medium">Explore</span>
        </button>
        <button
          onClick={() => setActiveScreen('saved')}
          className={`flex flex-col items-center gap-1 ${activeScreen === 'saved' ? 'text-[#4A90D9]' : 'text-gray-500'}`}
        >
          <Bookmark className="w-6 h-6" />
          <span className="text-xs font-medium">Saved</span>
        </button>
        <button
          onClick={() => setActiveScreen('profile')}
          className={`flex flex-col items-center gap-1 ${activeScreen === 'profile' ? 'text-[#4A90D9]' : 'text-gray-500'}`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs font-medium">Profile</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      {selectedNGO ? (
        <NGOProfileScreen ngo={selectedNGO} />
      ) : (
        <>
          {activeScreen === 'home' && <HomeScreen />}
          {activeScreen === 'explore' && <ExploreScreen />}
          {activeScreen === 'saved' && <SavedScreen />}
          {activeScreen === 'profile' && <ProfileScreen />}
        </>
      )}

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Modals */}
      {showDiscoveryChat && <DiscoveryChatModal />}
      {showVolunteerModal && <VolunteerModal />}
    </div>
  )
}
