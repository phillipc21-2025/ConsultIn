import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-3xl mx-auto text-center">
        <Card className="linkedin-card mb-8">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold mb-6 text-[#191919]">Welcome to LinkedIn</h1>
            <p className="text-lg mb-8 text-[#666666]">
              Connect with professionals, stay informed about your industry, and grow your business.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-6 bg-[#f3f2ef] rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Regular Feed</h2>
                <p className="mb-4 text-[#666666]">
                  Stay connected with your network and industry updates.
                </p>
                <Link href="/">
                  <Button className="w-full bg-[#0a66c2] hover:bg-blue-700">
                    Go to Feed
                  </Button>
                </Link>
              </div>
              
              <div className="p-6 bg-[#e8f3ff] rounded-lg border-2 border-[#0a66c2]">
                <h2 className="text-xl font-semibold mb-2">SMB Solutions</h2>
                <p className="mb-4 text-[#666666]">
                  Access personalized solutions for your small business.
                </p>
                <Link href="/smb">
                  <Button className="w-full bg-[#0a66c2] hover:bg-blue-700">
                    Go to SMB Page
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Why Use LinkedIn SMB Solutions?</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="linkedin-card">
              <CardContent className="p-4">
                <div className="mb-2">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" 
                    alt="Business networking" 
                    className="rounded-lg w-full h-40 object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">Expert Connections</h3>
                <p className="text-sm text-[#666666]">Connect with industry experts who can help solve your specific challenges.</p>
              </CardContent>
            </Card>
            
            <Card className="linkedin-card">
              <CardContent className="p-4">
                <div className="mb-2">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" 
                    alt="Problem solving" 
                    className="rounded-lg w-full h-40 object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">Personalized Solutions</h3>
                <p className="text-sm text-[#666666]">Get AI-powered recommendations tailored to your business needs.</p>
              </CardContent>
            </Card>
            
            <Card className="linkedin-card">
              <CardContent className="p-4">
                <div className="mb-2">
                  <img 
                    src="https://images.unsplash.com/photo-1560264280-88b68371db39?auto=format&fit=crop&w=800&q=80" 
                    alt="Small business growth" 
                    className="rounded-lg w-full h-40 object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">Resource Access</h3>
                <p className="text-sm text-[#666666]">Discover training, tools, and services designed for small businesses.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Link href="/smb">
          <Button className="bg-[#0a66c2] hover:bg-blue-700 px-8 py-2 text-lg">
            Try SMB Solutions Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
