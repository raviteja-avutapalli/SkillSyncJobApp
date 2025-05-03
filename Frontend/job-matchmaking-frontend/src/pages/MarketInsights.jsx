import MainLayout from "../layouts/MainLayout";
import { TrendingUp, DollarSign, MapPin, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";

function MarketInsights() {
  const [trends, setTrends] = useState([]);
  const [locations, setLocations] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [news, setNews] = useState([]);

  useEffect(() => {

    
    const loadData = async () => {
      const fetchType = async (type, setter) => {
        const res = await fetch(`http://localhost:5000/api/insights?type=${type}`);
        if (res.ok) {
          const data = await res.json();
          setter(data.map(d => ({
            ...d,
            extra: typeof d.extra === "string" ? JSON.parse(d.extra || '{}') : d.extra
          })));
                  }
      };
    
      await Promise.all([
        fetchType("trend", setTrends),
        fetchType("salary", setSalaries),
        fetchType("news", setNews)
      ]);
    
      const res = await fetch("http://localhost:5000/api/insights/hotspots/jobs");
      if (res.ok) {
        const data = await res.json();
        setLocations(data);
      }
    };
    

    loadData();
  }, []);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4">

        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl mb-12 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-20"></div>
          <div className="relative z-10 p-10 md:p-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Job Market <span className="text-yellow-300">Insights</span>
            </h1>
            <p className="text-indigo-100 text-lg md:text-xl max-w-2xl">
              Stay ahead with the latest trends, salaries, and opportunities in the tech industry
            </p>
          </div>
        </div>

        {/* Trends */}
        <div className="group rounded-3xl bg-gradient-to-br from-white to-indigo-50 p-1 shadow-xl hover:shadow-2xl transition-all duration-300 mb-8">
          <div className="bg-white h-full rounded-[22px] p-8">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-indigo-100 rounded-2xl mr-4">
                <TrendingUp className="text-indigo-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Industry Trends</h2>
            </div>
            <ul className="text-gray-600 leading-relaxed list-disc pl-5">
              {trends.map((item, i) => (
                <li key={i}>
                  {item.extra.role} — <span className="text-indigo-600">{item.extra.trend_type}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Locations */}
        <div className="group rounded-3xl bg-gradient-to-br from-white to-emerald-50 p-1 shadow-xl hover:shadow-2xl transition-all duration-300 mb-8">
          <div className="bg-white h-full rounded-[22px] p-8">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-emerald-100 rounded-2xl mr-4">
                <MapPin className="text-emerald-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Geographic Hotspots</h2>
            </div>
            <div className="space-y-4">
              {locations.map((item, i) => (
                <div key={i} className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  <span className="font-medium text-gray-700">
  {item.title} — {item.location}
</span>
                  <div className="ml-auto bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full">
                  {item.count} listings
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Salaries */}
        <div className="mb-12">
          <div className="flex items-center mb-8">
            <div className="p-3 bg-amber-100 rounded-2xl mr-4">
              <DollarSign className="text-amber-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Salary Ranges</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {salaries.map((item, i) => (
              <div key={i} className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-xl text-gray-800">{item.extra.title}</h3>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm">
                      {item.extra.title?.split(' ')[0]?.[0]}{item.extra.title?.split(' ')[1]?.[0]}
                    </span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">${item.extra.salary}</div>
                <p className="text-sm text-gray-500 flex items-center">
                  <MapPin size={14} className="mr-1" /> {item.extra.country}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                  {(item.extra.tags?.split(',') || []).map((t, j) => (
                    <span key={j} className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* News */}
        <div>
          <div className="flex items-center mb-8">
            <div className="p-3 bg-rose-100 rounded-2xl mr-4">
              <Newspaper className="text-rose-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">News & Updates</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((item, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="bg-gradient-to-r from-rose-500 to-orange-500 h-3"></div>
                <div className="p-6">
                  <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 text-xs rounded-full mb-4">
                    {item.tags?.split(',')[0] || 'Update'}
                  </span>
                  <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-rose-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.content.slice(0, 150)}...</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(item.published_at).toDateString()}
                    </span>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}

export default MarketInsights;
