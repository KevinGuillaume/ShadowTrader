interface MarketFooterProps {
    market: any;
  }
  
  const MarketFooter: React.FC<MarketFooterProps> = ({ market }) => (
    <section className="text-sm text-gray-500 border-t border-gray-800 pt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <p><span className="font-medium text-gray-300">ID:</span> {market.id}</p>
        {market.slug && <p><span className="font-medium text-gray-300">Slug:</span> {market.slug}</p>}
        {market.conditionId && <p><span className="font-medium text-gray-300">Condition ID:</span> {market.conditionId}</p>}
      </div>
    </section>
  );
  
  export default MarketFooter;