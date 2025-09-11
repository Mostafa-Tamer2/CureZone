import React from "react";
import { MessageSquare, Package, ThumbsUp, Truck } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type Props = {};
interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  title,
  description,
  color,
}) => {
  return (
    <div className="flex items-start p-6 bg-white rounded-xl shadow-sm">
      <div className={`${color} p-3 rounded-full mr-4 flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-blue-900 mb-2 text-lg">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default function FeatureSection({}: Props) {
  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Why Choose Us?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide quality healthcare products with exceptional service to
            make your life healthier and easier.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureItem
            icon={<Truck className="h-6 w-6 text-white" />}
            title="Fast Delivery"
            description="Get your medications and health products delivered quickly to your doorstep."
            color="bg-blue-600"
          />
          <FeatureItem
            icon={<ThumbsUp className="h-6 w-6 text-white" />}
            title="Quality Products"
            description="We ensure all our products meet the highest quality standards and regulations."
            color="bg-blue-600"
          />
          <FeatureItem
            icon={<Package className="h-6 w-6 text-white" />}
            title="Wide Selection"
            description="Browse through our extensive range of healthcare products and medications."
            color="bg-blue-600"
          />
          <FeatureItem
            icon={<MessageSquare className="h-6 w-6 text-white" />}
            title="24/7 Support"
            description="Our customer service team is available around the clock to assist you."
            color="bg-blue-600"
          />
        </div>
      </div>
    </div>
  );
}
