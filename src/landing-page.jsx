"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { CheckCircle, List, Calendar, Bell, ArrowRight, ChevronDown } from "lucide-react"

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)

    // Feature rotation
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4)
    }, 3000)

    // Add smooth scroll behavior
    const handleAnchorClick = (e) => {
      const href = e.target.getAttribute("href")
      if (href && href.startsWith("#")) {
        e.preventDefault()
        const targetId = href.substring(1)
        const targetElement = document.getElementById(targetId)

        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Offset for header
            behavior: "smooth",
          })

          // Update URL without page jump
          window.history.pushState(null, null, href)
        }
      }
    }

    // Add event listeners to all anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]')
    anchorLinks.forEach((anchor) => {
      anchor.addEventListener("click", handleAnchorClick)
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearInterval(interval)

      // Clean up event listeners
      anchorLinks.forEach((anchor) => {
        anchor.removeEventListener("click", handleAnchorClick)
      })
    }
  }, [])

  // Function to handle smooth scrolling
  const scrollToSection = (sectionId) => {
    const targetElement = document.getElementById(sectionId)
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#020F2B] text-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-[#020F2B]/90 backdrop-blur-sm py-3 shadow-lg" : "bg-transparent py-5"}`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-[#A7E8D2]" />
            <span className="ml-2 text-2xl font-bold">ToDone</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a
              href="#features"
              className="hover:text-[#A7E8D2] transition-colors"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("features")
              }}
            >
              Features
            </a>
            <a
              href="#pricing"
              className="hover:text-[#A7E8D2] transition-colors"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("pricing")
              }}
            >
              Pricing
            </a>
            <a
              href="#testimonials"
              className="hover:text-[#A7E8D2] transition-colors"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("testimonials")
              }}
            >
              Testimonials
            </a>
            <a
              href="#faq"
              className="hover:text-[#A7E8D2] transition-colors"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection("faq")
              }}
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="px-4 py-2 rounded-md hover:bg-white/10 transition-colors">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-[#A7E8D2] text-[#020F2B] px-4 py-2 rounded-md font-medium hover:bg-[#A7E8D2]/80 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Get more <span className="text-[#A7E8D2]">done</span> with less stress
              </h1>
              <p className="text-xl mb-8 text-gray-300 max-w-lg">
                The smart todo list that helps you focus on what matters most. Organize, prioritize, and accomplish.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/signup"
                  className="bg-[#A7E8D2] text-[#020F2B] px-6 py-3 rounded-md font-medium text-center hover:bg-[#A7E8D2]/80 transition-colors transform hover:scale-105 duration-200"
                >
                  Get Started Free
                </Link>
                <a
                  href="#features"
                  className="border border-[#A7E8D2] text-[#A7E8D2] px-6 py-3 rounded-md font-medium text-center hover:bg-[#A7E8D2]/10 transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection("features")
                  }}
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="bg-[#051640] p-6 rounded-xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="bg-[#031233] p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-xl">Today's Tasks</h3>
                    <span className="text-[#A7E8D2]">4/7 completed</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { text: "Finish project proposal", completed: true },
                      { text: "Schedule team meeting", completed: true },
                      { text: "Review quarterly goals", completed: true },
                      { text: "Update website content", completed: true },
                      { text: "Prepare presentation", completed: false },
                      { text: "Call with client", completed: false },
                      { text: "Send weekly report", completed: false },
                    ].map((task, index) => (
                      <div
                        key={index}
                        className={`flex items-center p-3 rounded-lg ${task.completed ? "bg-[#A7E8D2]/10" : "bg-[#051640]"}`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${task.completed ? "bg-[#A7E8D2] text-[#020F2B]" : "border border-gray-500"}`}
                        >
                          {task.completed && <CheckCircle className="w-4 h-4" />}
                        </div>
                        <span className={task.completed ? "line-through text-gray-400" : ""}>{task.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-0 bg-[#A7E8D2] text-[#020F2B] p-4 rounded-lg shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                <p className="font-bold">Productivity up 37% this week! 🚀</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#031233]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why choose <span className="text-[#A7E8D2]">ToDone</span>?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our powerful features help you stay organized and focused on what matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                {
                  icon: <List className="h-8 w-8 text-[#A7E8D2]" />,
                  title: "Smart Task Organization",
                  description: "Automatically categorize and prioritize your tasks based on deadlines and importance.",
                },
                {
                  icon: <Calendar className="h-8 w-8 text-[#A7E8D2]" />,
                  title: "Intuitive Scheduling",
                  description:
                    "Plan your day with our drag-and-drop calendar interface that syncs across all your devices.",
                },
                {
                  icon: <Bell className="h-8 w-8 text-[#A7E8D2]" />,
                  title: "Smart Reminders",
                  description:
                    "Get notified at the right time with context-aware reminders that know when you need them.",
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-[#A7E8D2]" />,
                  title: "Progress Tracking",
                  description: "Visualize your productivity with beautiful charts and celebrate your accomplishments.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl transition-all duration-300 ${activeFeature === index ? "bg-[#051640] shadow-lg scale-105" : "hover:bg-[#051640] hover:shadow-md"}`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative">
              <div className="bg-[#051640] p-6 rounded-xl shadow-2xl">
                <div className="tabs flex border-b border-gray-700">
                  <div className="tab px-4 py-2 border-b-2 border-[#A7E8D2] text-[#A7E8D2] font-medium">Dashboard</div>
                  <div className="tab px-4 py-2">Calendar</div>
                  <div className="tab px-4 py-2">Analytics</div>
                </div>
                <div className="p-4">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-3">Task Completion Rate</h3>
                    <div className="h-12 bg-[#031233] rounded-lg overflow-hidden">
                      <div
                        className="h-full bg-[#A7E8D2] transition-all duration-1000"
                        style={{ width: `${65 + Math.sin(Date.now() / 1000) * 10}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span>This Week</span>
                      <span className="text-[#A7E8D2] font-medium">72%</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Upcoming Deadlines</h3>
                    {[
                      { text: "Project Alpha submission", date: "Tomorrow", priority: "high" },
                      { text: "Team retrospective", date: "In 2 days", priority: "medium" },
                      { text: "Quarterly review", date: "Next week", priority: "low" },
                    ].map((task, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-[#031233] rounded-lg">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-3 ${
                              task.priority === "high"
                                ? "bg-red-500"
                                : task.priority === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                          ></div>
                          <span>{task.text}</span>
                        </div>
                        <span className="text-sm text-gray-400">{task.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-0 bg-[#A7E8D2] text-[#020F2B] p-3 rounded-lg shadow-lg transform rotate-12 hover:rotate-0 transition-transform duration-500">
                <p className="font-bold text-sm">New feature available!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What our users say</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "Product Manager",
                content:
                  "ToDone has completely changed how I manage my team's projects. The intuitive interface and smart prioritization have boosted our productivity by at least 30%.",
              },
              {
                name: "Sarah Williams",
                role: "Freelance Designer",
                content:
                  "As someone who juggles multiple clients and projects, ToDone has been a lifesaver. I can finally keep track of everything without feeling overwhelmed.",
              },
              {
                name: "Michael Chen",
                role: "Software Engineer",
                content:
                  "The integration capabilities are amazing! ToDone connects with all my development tools, making it the central hub for all my tasks and deadlines.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#051640] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#A7E8D2]">
                      ★
                    </span>
                  ))}
                </div>
                <p className="mb-6 text-gray-300">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#A7E8D2] rounded-full mr-4 flex items-center justify-center text-[#020F2B] font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#031233]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Choose the plan that works best for you and your team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "Perfect for getting started",
                features: ["Up to 20 tasks", "Basic prioritization", "Mobile app access", "7-day task history"],
                cta: "Get Started",
                highlighted: false,
              },
              {
                name: "Pro",
                price: "$9",
                period: "per month",
                description: "Everything you need to be productive",
                features: [
                  "Unlimited tasks",
                  "Advanced prioritization",
                  "Team collaboration (up to 5)",
                  "Recurring tasks",
                  "Calendar integration",
                  "30-day task history",
                ],
                cta: "Try Free for 14 Days",
                highlighted: true,
              },
              {
                name: "Team",
                price: "$19",
                period: "per month",
                description: "For teams that need more",
                features: [
                  "Everything in Pro",
                  "Unlimited team members",
                  "Admin controls",
                  "Advanced analytics",
                  "Priority support",
                  "API access",
                  "Unlimited history",
                ],
                cta: "Contact Sales",
                highlighted: false,
              },
            ].map((plan, index) => (
              <div
                key={index}
                className={`rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-[#051640] to-[#020F2B] shadow-xl border border-[#A7E8D2]/30"
                    : "bg-[#051640] shadow-lg"
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-[#A7E8D2] text-[#020F2B] text-center py-2 font-bold">Most Popular</div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                  <p className="text-gray-300 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-[#A7E8D2] mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signup"
                    className={`block text-center py-3 rounded-md font-medium transition-colors ${
                      plan.highlighted
                        ? "bg-[#A7E8D2] text-[#020F2B] hover:bg-[#A7E8D2]/80"
                        : "bg-[#020F2B] hover:bg-[#020F2B]/80 border border-[#A7E8D2]/30"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">Got questions? We've got answers.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How does ToDone differ from other todo apps?",
                answer:
                  "ToDone uses smart prioritization algorithms to help you focus on what matters most. Unlike other apps that just list tasks, we help you organize, prioritize, and accomplish your goals with less stress.",
              },
              {
                question: "Can I use ToDone on multiple devices?",
                answer:
                  "ToDone syncs seamlessly across all your devices - desktop, tablet, and mobile. Your tasks are always up-to-date no matter where you are.",
              },
              {
                question: "Is my data secure?",
                answer:
                  "Security is our top priority. We use industry-standard encryption to protect your data, and we never share your information with third parties without your explicit consent.",
              },
              {
                question: "Can I collaborate with my team?",
                answer:
                  "Yes! Our Pro and Team plans include collaboration features that allow you to share tasks, assign responsibilities, and track progress together.",
              },
              {
                question: "What if I need help getting started?",
                answer:
                  "We offer comprehensive documentation, video tutorials, and responsive customer support to help you get the most out of ToDone. Our Pro and Team plans also include priority support.",
              },
            ].map((faq, index) => (
              <div key={index} className="bg-[#051640] rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="flex justify-between items-center p-6 cursor-pointer">
                    <h3 className="text-xl font-medium">{faq.question}</h3>
                    <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-6 text-gray-300">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#A7E8D2] text-[#020F2B]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to get more done?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of productive users and start organizing your life today.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center bg-[#020F2B] text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-[#020F2B]/90 transition-colors transform hover:scale-105 duration-200"
          >
            Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="mt-4 text-sm">No credit card required. Free forever.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#020F2B] py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-[#A7E8D2]" />
                <span className="ml-2 text-xl font-bold">ToDone</span>
              </div>
              <p className="text-gray-400 mb-4">The smart todo list that helps you focus on what matters most.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#A7E8D2]">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#A7E8D2]">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#A7E8D2]">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.731 0 1.324-.593 1.324-1.325v-21.35c0-.732-.593-1.325-1.324-1.325z"></path>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-[#A7E8D2]">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-[#A7E8D2]">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-gray-400 hover:text-[#A7E8D2]">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-gray-400 hover:text-[#A7E8D2]">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#A7E8D2]">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#A7E8D2]">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#A7E8D2]">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#A7E8D2]">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#A7E8D2]">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#A7E8D2]">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-[#A7E8D2]">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} ToDone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

