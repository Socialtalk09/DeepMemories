import { Forward, FileHeart, ShieldCheck } from "lucide-react";

interface StatsCardsProps {
  messageCount: number;
  recipientCount: number;
  trustedContactCount: number;
}

export default function StatsCards({
  messageCount,
  recipientCount,
  trustedContactCount
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Stats Card 1 */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
        <div className="rounded-full p-3 bg-primary-100 text-primary-600 mr-4">
          <Forward className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Created Messages</h3>
          <p className="text-2xl font-semibold">{messageCount}</p>
        </div>
      </div>
      
      {/* Stats Card 2 */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
        <div className="rounded-full p-3 bg-secondary-100 text-secondary-600 mr-4">
          <FileHeart className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Recipients</h3>
          <p className="text-2xl font-semibold">{recipientCount}</p>
        </div>
      </div>
      
      {/* Stats Card 3 */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center">
        <div className="rounded-full p-3 bg-green-100 text-green-600 mr-4">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Trusted Contacts</h3>
          <p className="text-2xl font-semibold">{trustedContactCount}</p>
        </div>
      </div>
    </div>
  );
}
