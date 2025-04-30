import React from 'react';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { Conversation } from '@shared/schema';

interface ActiveConversationsProps {
  conversations: Conversation[];
}

const ActiveConversations: React.FC<ActiveConversationsProps> = ({ conversations }) => {
  // In case we don't have enough conversations, create some mock active conversations
  const defaultConversations = [
    {
      id: 1001,
      title: "How did you overcome supply chain bottlenecks during COVID?",
      author: "Jane Martinez",
      authorTitle: "COO at Apex Manufacturing",
      authorImage: "https://randomuser.me/api/portraits/women/22.jpg",
      content: "Our suppliers in Asia were completely shut down for months, and we had to pivot quickly. We ended up finding domestic alternatives and redesigning parts of our product to work with available components.",
      postedTime: "3 hours ago",
      likes: 47,
      comments: 16,
      shares: 8,
      tags: ["#supplychain", "#resilience", "#manufacturing"]
    },
    {
      id: 1002,
      title: "Is anyone else seeing productivity gains with hybrid work?",
      author: "Michael Chen",
      authorTitle: "HR Director at TechValue Solutions",
      authorImage: "https://randomuser.me/api/portraits/men/54.jpg",
      content: "We've been measuring productivity before and after implementing our hybrid work policy. Seeing about 28% increase in output with higher employee satisfaction scores. How's everyone else's experience?",
      postedTime: "7 hours ago",
      likes: 103,
      comments: 42,
      shares: 15,
      tags: ["#remotework", "#productivity", "#corporateculture"]
    },
    {
      id: 1003,
      title: "Recommendations for SMB accounting software that integrates with Shopify?",
      author: "Samantha Wilson",
      authorTitle: "Founder of Boutique Essentials",
      authorImage: "https://randomuser.me/api/portraits/women/45.jpg",
      content: "We're growing fast and our current solution isn't scaling well. Need something cloud-based that handles multi-currency and has good inventory management. Budget around $150/month.",
      postedTime: "1 day ago",
      likes: 28,
      comments: 35,
      shares: 3,
      tags: ["#accounting", "#ecommerce", "#smallbusiness"]
    },
    {
      id: 1004,
      title: "How are other manufacturing SMBs dealing with rising material costs?",
      author: "Robert Johnson",
      authorTitle: "Owner at Precision Parts",
      authorImage: "https://randomuser.me/api/portraits/men/32.jpg",
      content: "Our main materials have increased 37% in cost over the past year. We've absorbed some but had to pass some to customers. Anyone found creative solutions beyond the usual price increases?",
      postedTime: "2 days ago",
      likes: 76,
      comments: 51,
      shares: 12,
      tags: ["#manufacturing", "#inflation", "#supplychain"]
    },
    {
      id: 1005,
      title: "Looking for recommendations on AI tools for customer service automation",
      author: "Priya Patel",
      authorTitle: "Customer Experience Manager at DataFlow",
      authorImage: "https://randomuser.me/api/portraits/women/63.jpg",
      content: "We're exploring options to automate routine customer inquiries while maintaining a personal touch. Has anyone implemented an AI chatbot that actually improved customer satisfaction?",
      postedTime: "3 days ago",
      likes: 89,
      comments: 33,
      shares: 17,
      tags: ["#customerservice", "#ai", "#automation"]
    }
  ];

  // Use provided conversations or fallback to defaults
  const displayConversations = conversations.length >= 5 ? conversations.slice(0, 5) : defaultConversations;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Active conversations on LinkedIn</h2>
        <a href="#" className="text-blue-600 hover:underline text-sm">See all</a>
      </div>
      
      <div className="space-y-4">
        {displayConversations.map((conversation) => (
          <Card key={conversation.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={
                      conversation.authorImage 
                      || (conversation as any).author?.profileImage 
                      || "https://randomuser.me/api/portraits/lego/1.jpg"
                    } 
                  />
                  <AvatarFallback>
                    {(conversation as any).author?.name?.substring(0, 2).toUpperCase() || 'UN'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="font-medium leading-tight">
                    {(conversation as any).author?.name || "LinkedIn Member"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {(conversation as any).author?.title || "Professional"}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {(conversation as any).postedTime || "Recently"}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-2">
              <h4 className="font-semibold mb-2">
                {conversation.title || "Discussion Topic"}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-3">
                {conversation.description || (conversation as any).content || "Join this conversation about business challenges and solutions."}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mt-3">
                {(conversation as any).tags?.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            
            <CardFooter className="pt-1 border-t">
              <div className="flex justify-between w-full">
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{(conversation as any).likes || "Like"}</span>
                </button>
                
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
                  <MessageSquare className="h-4 w-4" />
                  <span>{(conversation as any).comments || "Comment"}</span>
                </button>
                
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">
                  <Share2 className="h-4 w-4" />
                  <span>{(conversation as any).shares || "Share"}</span>
                </button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActiveConversations;