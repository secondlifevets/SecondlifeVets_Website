import { Star } from "lucide-react";

export default function GoogleReviewBanner() {
  const googleMapsUrl = "https://maps.app.goo.gl/B3MtDNy6kVCMpx8T8?g_st=iw";

  return (
    <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 animate-fade-in-up">
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex relative">
          <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center relative z-10 border border-amber-100">
            <span className="text-3xl">🐾</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center z-20 border border-amber-100">
            <Star size={14} className="text-amber-400 fill-amber-400" />
          </div>
        </div>
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <h3 className="font-display font-bold text-xl text-dark">Happy with our service?</h3>
          <p className="text-sm text-gray-600 mt-1 max-w-sm">
            Your feedback helps us provide the best elite veterinary care in Pakistan. Please leave us a review!
          </p>
        </div>
      </div>
      
      <a 
        href={googleMapsUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full sm:w-auto bg-white hover:bg-amber-50 border border-amber-200 text-amber-700 font-bold py-3 px-6 rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group whitespace-nowrap"
      >
        <Star size={18} className="group-hover:fill-amber-400 transition-colors" />
        Review on Google Maps
      </a>
    </div>
  );
}
