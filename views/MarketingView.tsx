
import React from 'react';
import { useApp } from '../App';
import { Megaphone, Rocket, BarChart2 } from 'lucide-react';

const MarketingView: React.FC = () => {
  const { t } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#061E29]">{t('marketing')}</h2>
        <p className="text-xs text-[#1D546D]">Manage your store's visibility</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white p-6 rounded-[2.5rem] border border-[#1D546D]/10 flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl">
            <Rocket size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#061E29]">Store SEO</h4>
            <p className="text-[10px] font-bold text-[#5F9598] uppercase">Optimize listing visibility</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-[#1D546D]/10 flex items-center gap-4">
          <div className="p-4 bg-[#061E29] text-white rounded-2xl">
            <Megaphone size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#061E29]">Ad Campaigns</h4>
            <p className="text-[10px] font-bold text-[#5F9598] uppercase">Run targeted marketplace ads</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-[#1D546D]/10 flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl">
            <BarChart2 size={24} />
          </div>
          <div>
            <h4 className="font-bold text-[#061E29]">Market Insights</h4>
            <p className="text-[10px] font-bold text-[#5F9598] uppercase">Competitor price tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingView;
