"use client";

import React, { useState } from "react";
import {
  Shield,
  Lock,
  Eye,
  FileText,
  Users,
  Mail,
  Phone,
  Calendar,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 bg-white shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          {icon}
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 text-gray-700 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
};

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = "January 15, 2025";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <Shield className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Your privacy and the security of your health information is our
              top priority
            </p>
            <p className="text-lg opacity-75 mt-4">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            Introduction
          </h2>
          <div className="prose prose-lg text-gray-700 leading-relaxed">
            <p className="mb-4">
              At HealthCare Pharmacy, we are committed to protecting your
              privacy and maintaining the confidentiality of your personal
              health information. This Privacy Policy explains how we collect,
              use, protect, and disclose your information in accordance with the
              Health Insurance Portability and Accountability Act (HIPAA) and
              other applicable privacy laws.
            </p>
            <p className="mb-4">
              This policy applies to all services provided by HealthCare
              Pharmacy, including prescription dispensing, consultation
              services, health screenings, and our website interactions.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="text-blue-800 font-medium">
                <strong>Important:</strong> As a healthcare provider, we follow
                strict HIPAA guidelines to ensure your protected health
                information (PHI) remains secure and confidential.
              </p>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-4">
          <AccordionItem
            title="Information We Collect"
            icon={<Eye className="w-5 h-5 text-green-600" />}
          >
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Personal Health Information (PHI)
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Prescription information and medication history</li>
                  <li>Medical conditions and allergies</li>
                  <li>Insurance information and coverage details</li>
                  <li>Doctor and healthcare provider information</li>
                  <li>Laboratory results and health screening data</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Personal Information
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Name, address, phone number, and email address</li>
                  <li>Date of birth and emergency contact information</li>
                  <li>Payment and billing information</li>
                  <li>Government-issued identification numbers</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Website and Digital Information
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Website usage data and cookies</li>
                  <li>Online account credentials and preferences</li>
                  <li>Communication history and support interactions</li>
                  <li>Device information and IP addresses</li>
                </ul>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem
            title="How We Use Your Information"
            icon={<Users className="w-5 h-5 text-purple-600" />}
          >
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Treatment and Care
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>
                    Dispensing prescriptions and providing medication counseling
                  </li>
                  <li>Monitoring drug interactions and allergic reactions</li>
                  <li>Coordinating care with your healthcare providers</li>
                  <li>Providing health screenings and immunizations</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Payment and Operations
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Processing insurance claims and billing</li>
                  <li>Managing your pharmacy account and preferences</li>
                  <li>Quality assurance and regulatory compliance</li>
                  <li>Staff training and professional development</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Communication and Services
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Prescription ready notifications and refill reminders</li>
                  <li>Health education and medication adherence programs</li>
                  <li>Customer service and support</li>
                  <li>
                    Emergency contact in case of drug recalls or safety alerts
                  </li>
                </ul>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem
            title="Your Privacy Rights"
            icon={<Shield className="w-5 h-5 text-blue-600" />}
          >
            <div className="space-y-4">
              <p className="text-gray-700">
                Under HIPAA and other privacy laws, you have the following
                rights regarding your health information:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Access Rights
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                    <li>Request copies of your health records</li>
                    <li>Review your prescription history</li>
                    <li>Access your account information</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">
                    Amendment Rights
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-green-800 text-sm">
                    <li>Request corrections to your records</li>
                    <li>Update personal information</li>
                    <li>Dispute inaccurate information</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">
                    Restriction Rights
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-purple-800 text-sm">
                    <li>Limit how we use your information</li>
                    <li>Restrict sharing with certain parties</li>
                    <li>Request confidential communications</li>
                  </ul>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    Notification Rights
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-orange-800 text-sm">
                    <li>Be notified of privacy breaches</li>
                    <li>Receive disclosure accounting</li>
                    <li>Get copies of privacy notices</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  How to Exercise Your Rights
                </h4>
                <p className="text-gray-700 mb-2">
                  To exercise any of these rights, please contact our Privacy
                  Officer:
                </p>
                <div className="space-y-1 text-gray-700">
                  <p>
                    <strong>Email:</strong> privacy@healthcarepharmacy.com
                  </p>
                  <p>
                    <strong>Phone:</strong> (555) 123-4567
                  </p>
                  <p>
                    <strong>Mail:</strong> Privacy Officer, 123 Health Street,
                    Medical City, MC 12345
                  </p>
                </div>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem
            title="Data Security and Protection"
            icon={<Lock className="w-5 h-5 text-red-600" />}
          >
            <div className="space-y-4">
              <p className="text-gray-700">
                We implement comprehensive security measures to protect your
                personal health information:
              </p>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Technical Safeguards
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>End-to-end encryption for all data transmission</li>
                  <li>Secure servers with advanced firewall protection</li>
                  <li>Multi-factor authentication for system access</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Automatic data backup and disaster recovery systems</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Physical Safeguards
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Restricted access to pharmacy and office areas</li>
                  <li>Secure storage of physical documents and records</li>
                  <li>Surveillance systems and alarm monitoring</li>
                  <li>Proper disposal of confidential information</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Administrative Safeguards
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Comprehensive staff training on privacy and security</li>
                  <li>Background checks for all employees</li>
                  <li>Signed confidentiality agreements</li>
                  <li>Regular policy updates and compliance monitoring</li>
                  <li>Incident response procedures for security breaches</li>
                </ul>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem
            title="Cookies and Website Privacy"
            icon={<Eye className="w-5 h-5 text-indigo-600" />}
          >
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Types of Cookies We Use
                </h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>
                    <strong>Essential Cookies:</strong> Required for website
                    functionality and security
                  </li>
                  <li>
                    <strong>Functional Cookies:</strong> Remember your
                    preferences and settings
                  </li>
                  <li>
                    <strong>Analytics Cookies:</strong> Help us understand
                    website usage patterns
                  </li>
                  <li>
                    <strong>Marketing Cookies:</strong> Used only with your
                    consent for relevant communications
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Managing Cookies
                </h4>
                <p className="text-gray-700 mb-2">
                  You can control cookies through your browser settings:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Block all cookies or specific types</li>
                  <li>Delete existing cookies from your device</li>
                  <li>Set preferences for individual websites</li>
                  <li>Receive notifications before cookies are placed</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  <strong>Note:</strong> Disabling certain cookies may affect
                  website functionality and your ability to access some features
                  of our online services.
                </p>
              </div>
            </div>
          </AccordionItem>

          <AccordionItem
            title="Changes to This Policy"
            icon={<Calendar className="w-5 h-5 text-gray-600" />}
          >
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy periodically to reflect changes
              in our practices, technology, legal requirements, or business
              operations. When we make significant changes, we will:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4 mb-4">
              <li>Post the updated policy on our website</li>
              <li>Send notification to your registered email address</li>
              <li>Display notices in our pharmacy locations</li>
              <li>
                Provide at least 30 days notice before changes take effect
              </li>
            </ul>
            <p className="text-gray-700">
              Your continued use of our services after policy changes indicates
              your acceptance of the updated terms.
            </p>
          </AccordionItem>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mt-12 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Questions About Privacy?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">privacy@healthcarepharmacy.com</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">(555) 123-4567</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">
                123 Health Street
                <br />
                Medical City, MC 12345
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
