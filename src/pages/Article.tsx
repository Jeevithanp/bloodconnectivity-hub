
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Droplet, MapPin, Bell, Users, MessageSquare, Database, Brain, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Article = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-6">Smart Blood Donation and Emergency Request System</h1>
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-8">
            <span>Published on April 23, 2023</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground"></span>
            <span>Healthcare Innovation</span>
          </div>
          
          <div className="relative rounded-xl overflow-hidden mb-10 shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1615461066841-6116e61059e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Blood donation center with digital technology" 
              className="w-full h-auto aspect-[16/9] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <p className="text-white p-6 text-sm">
                Modern blood donation centers leveraging technology to save lives
              </p>
            </div>
          </div>
        </div>

        <article className="prose prose-lg dark:prose-invert max-w-none animate-fade-in">
          <h2>Introduction</h2>
          <p>
            In emergency medical situations, every second counts. Timely access to compatible blood can be the difference 
            between life and death for patients suffering from severe injuries, undergoing complex surgeries, or facing 
            medical emergencies. Traditional blood donation systems, while well-intentioned, often struggle to meet 
            the urgent demands of emergency situations. This gap has highlighted the critical need for real-time 
            blood donation systems that can quickly connect donors with recipients during emergencies.
          </p>

          <h2>Problem Statement</h2>
          <p>
            Traditional blood donation methods face several critical inefficiencies that hinder their effectiveness in 
            emergency situations:
          </p>
          <ul>
            <li><strong>Outdated Databases:</strong> Many blood banks rely on manually updated donor records that are often 
            incomplete or out of date, making it difficult to quickly identify eligible donors.</li>
            <li><strong>Slow Manual Outreach:</strong> When blood is needed urgently, staff must manually call potential 
            donors one by one, a time-consuming process that delays critical care.</li>
            <li><strong>Lack of Location Tracking:</strong> Without geographical targeting, blood banks cannot efficiently 
            identify donors who are physically nearby and available during emergencies.</li>
            <li><strong>Fragmented Communication:</strong> Disconnected systems between hospitals, blood banks, and donors 
            create coordination challenges and information delays.</li>
            <li><strong>Limited Real-time Visibility:</strong> Hospitals often lack visibility into blood availability 
            across different blood banks, leading to suboptimal distribution of resources.</li>
          </ul>

          <div className="bg-card p-6 rounded-xl shadow-sm border my-8">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Impact of Delays
            </h3>
            <p className="text-muted-foreground mb-0">
              Studies show that in trauma cases, every 30-minute delay in blood transfusion increases mortality risk by 
              approximately 5%. A smart blood donation system could reduce average response time from hours to minutes.
            </p>
          </div>

          <h2>Proposed Solution</h2>
          <p>
            To address these challenges, we propose a Smart Blood Donation and Emergency Request System in the form of 
            a mobile application that leverages modern technology to create a seamless and efficient platform connecting 
            donors, recipients, hospitals, and blood banks.
          </p>

          <p>
            This integrated system revolutionizes the blood donation process by incorporating:
          </p>
          <ul>
            <li>GPS tracking for real-time donor location monitoring</li>
            <li>Advanced filtering to identify eligible donors based on blood type, location, and donation history</li>
            <li>Instant push notifications for emergency blood requests</li>
            <li>Secure in-app communication between donors and medical institutions</li>
            <li>Centralized database with comprehensive donor records and health information</li>
          </ul>

          <h2>Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="bg-card p-6 rounded-lg border shadow-sm hover-lift">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Donor Tracking</h3>
              <p className="text-muted-foreground">
                GPS-based location services allow the system to identify and contact nearby donors during emergencies, 
                significantly reducing response time.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border shadow-sm hover-lift">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automated Donor Filtering</h3>
              <p className="text-muted-foreground">
                The system automatically filters potential donors based on blood type compatibility, proximity to the 
                request location, and eligibility based on previous donation dates.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border shadow-sm hover-lift">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Notifications</h3>
              <p className="text-muted-foreground">
                Emergency alerts are sent to eligible donors in real-time, with priority notifications for rare blood 
                types and critical situations.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border shadow-sm hover-lift">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct Communication</h3>
              <p className="text-muted-foreground">
                Secure in-app messaging and calling features enable direct communication between donors, recipients, and 
                healthcare providers.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border shadow-sm hover-lift">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Centralized Database</h3>
              <p className="text-muted-foreground">
                A comprehensive database maintains donor health records, donation history, and eligibility status, 
                ensuring safe and appropriate donor matching.
              </p>
            </div>
          </div>

          <h2>Technology Stack</h2>
          <p>
            The Smart Blood Donation System leverages a robust technology stack to ensure reliability, security, and 
            real-time performance:
          </p>
          <ul>
            <li><strong>Mobile Development:</strong> Java-based Android development and Swift for iOS ensure cross-platform 
            compatibility and optimal performance.</li>
            <li><strong>Database Management:</strong> MySQL provides a secure and scalable solution for storing donor 
            information, blood bank inventory, and donation records.</li>
            <li><strong>Location Services:</strong> Google Maps API enables precise GPS tracking and efficient route 
            planning for donors traveling to donation centers.</li>
            <li><strong>Real-time Notifications:</strong> Firebase Cloud Messaging delivers instant push notifications to 
            alert donors about emergency blood requests and eligibility updates.</li>
            <li><strong>Secure Communication:</strong> End-to-end encryption protocols safeguard all communications and 
            personal health information within the platform.</li>
          </ul>

          <div className="bg-secondary/50 p-6 rounded-xl my-8">
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Donor Matching Algorithm
            </h3>
            <p className="mb-4">
              The system employs AI-powered algorithms, particularly K-Nearest Neighbors (KNN), to optimize the donor 
              matching process:
            </p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>When an emergency request is initiated, the system identifies the request location.</li>
              <li>The KNN algorithm searches for eligible donors (based on blood type and donation history) within a defined radius.</li>
              <li>Donors are ranked by proximity, availability, and previous response rates.</li>
              <li>Notifications are sent in batches, starting with the most promising matches.</li>
              <li>The algorithm continuously learns from successful donations to improve future matching efficiency.</li>
            </ol>
          </div>

          <h2>Impact and Future Enhancements</h2>
          <p>
            The Smart Blood Donation System has already demonstrated significant improvements in emergency response times 
            and donation efficiency. Looking ahead, several enhancements could further revolutionize blood donation:
          </p>
          
          <ul>
            <li><strong>AI-driven Demand Prediction:</strong> Machine learning algorithms can analyze historical data to 
            predict blood demand patterns, helping blood banks prepare for seasonal variations and emergency scenarios.</li>
            <li><strong>Hospital Blood Bank Integration:</strong> Direct integration with hospital information systems can 
            provide real-time visibility into blood inventory levels across the healthcare network.</li>
            <li><strong>Multilingual Support:</strong> Adding multiple language options would expand the platform's reach 
            to diverse communities and increase donor participation.</li>
            <li><strong>Gamification Elements:</strong> Implementing achievement badges, donation streaks, and community 
            challenges could increase donor retention and engagement.</li>
            <li><strong>Wearable Integration:</strong> Connecting with health wearables could provide additional donor 
            health data and simplify eligibility verification.</li>
          </ul>

          <h2>Conclusion</h2>
          <p>
            The Smart Blood Donation and Emergency Request System represents a transformative approach to blood donation 
            management. By leveraging modern technology, this system addresses the critical inefficiencies in traditional 
            methods and provides a faster, more reliable process for connecting donors with those in need.
          </p>
          
          <p>
            In emergency situations where every minute counts, this intelligent platform ensures that the right blood 
            reaches the right patient at the right time. Beyond the immediate life-saving benefits, the system also 
            promotes a culture of regular donation through better donor engagement and simplified processes.
          </p>
          
          <p>
            As this technology continues to evolve and integrate with broader healthcare systems, it has the potential 
            to revolutionize emergency healthcare response and blood resource management globally, ultimately saving 
            countless lives through timely intervention.
          </p>

          <div className="mt-12 border-t pt-8">
            <div className="flex items-center gap-3">
              <Droplet className="text-primary h-5 w-5" />
              <span className="text-sm font-medium">Share this article to spread awareness</span>
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" size="sm">Share on Twitter</Button>
              <Button variant="outline" size="sm">Share on Facebook</Button>
              <Button variant="outline" size="sm">Share on LinkedIn</Button>
            </div>
          </div>
        </article>
        
        <div className="mt-12 pt-8 border-t animate-fade-in">
          <h3 className="text-2xl font-bold mb-6">Related Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/" className="group block">
              <div className="rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h4 className="font-semibold group-hover:text-primary transition-colors">
                    Become a Blood Donor Today
                  </h4>
                  <p className="text-muted-foreground text-sm mt-2">
                    Learn how you can make a difference by joining our donor community.
                  </p>
                </div>
              </div>
            </Link>
            <Link to="/" className="group block">
              <div className="rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <h4 className="font-semibold group-hover:text-primary transition-colors">
                    Emergency Blood Request Guide
                  </h4>
                  <p className="text-muted-foreground text-sm mt-2">
                    A step-by-step guide on how to use our platform during emergencies.
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Article;
