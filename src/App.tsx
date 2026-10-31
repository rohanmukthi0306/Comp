/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FindItProvider, useFindIt } from './context/FindItContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { CalendarPage } from './pages/CalendarPage';
import { FindItHome } from './pages/FindItHome';
import { FoundIt } from './pages/FoundIt';
import { FindLostItem } from './pages/FindLostItem';
import { ItemDetails } from './pages/ItemDetails';
import { Notifications } from './pages/Notifications';
import { Announcements } from './pages/Announcements';
import { Profile } from './pages/Profile';

export type RouteType =
  | 'home'
  | 'events'
  | 'event-details'
  | 'calendar'
  | 'findit'
  | 'found-it'
  | 'find-item'
  | 'item-details'
  | 'notifications'
  | 'announcements'
  | 'profile';

function AppContent() {
  const { unreadNotifsCount } = useFindIt();
  const [currentRoute, setCurrentRoute] = useState<RouteType>('home');
  const [selectedEventId, setSelectedEventId] = useState<string>('mavericks-2026');
  const [selectedItemId, setSelectedItemId] = useState<string>('seed-fnd-1');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2026-10-30');
  const [navigationHistory, setNavigationHistory] = useState<RouteType[]>(['home']);

  const navigateTo = (route: string, id?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (id) {
      if (route === 'event-details') {
        setSelectedEventId(id);
      } else if (route === 'item-details') {
        setSelectedItemId(id);
      }
    }

    setNavigationHistory((prev) => [...prev, route as RouteType]);
    setCurrentRoute(route as RouteType);
  };

  const handleBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // pop current
      const previousRoute = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentRoute(previousRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentRoute('home');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F6] text-[#17211D] flex flex-col md:flex-row antialiased selection:bg-[#DDEDE6] selection:text-[#167C61]">
      {/* Desktop Fixed Sidebar */}
      <Sidebar
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        unreadCount={unreadNotifsCount}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          onBack={handleBack}
          unreadCount={unreadNotifsCount}
        />

        {/* Scrollable Page Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-5 pb-24 md:pb-12">
          {currentRoute === 'home' && <Dashboard onNavigate={navigateTo} />}

          {currentRoute === 'events' && <Events onNavigate={navigateTo} />}

          {currentRoute === 'event-details' && (
            <EventDetails
              eventId={selectedEventId}
              onNavigate={navigateTo}
              onBack={handleBack}
            />
          )}

          {currentRoute === 'calendar' && (
            <CalendarPage
              selectedDate={selectedCalendarDate}
              onSelectDate={setSelectedCalendarDate}
              onNavigate={navigateTo}
            />
          )}

          {currentRoute === 'findit' && <FindItHome onNavigate={navigateTo} />}

          {currentRoute === 'found-it' && (
            <FoundIt onBack={handleBack} onNavigate={navigateTo} />
          )}

          {currentRoute === 'find-item' && (
            <FindLostItem
              onBack={handleBack}
              onNavigate={navigateTo}
              selectedDate={selectedCalendarDate}
              onSelectDate={setSelectedCalendarDate}
            />
          )}

          {currentRoute === 'item-details' && (
            <ItemDetails
              itemId={selectedItemId}
              onBack={handleBack}
              onNavigate={navigateTo}
            />
          )}

          {currentRoute === 'notifications' && (
            <Notifications onNavigate={navigateTo} />
          )}

          {currentRoute === 'announcements' && (
            <Announcements onNavigate={navigateTo} />
          )}

          {currentRoute === 'profile' && <Profile onNavigate={navigateTo} />}
        </main>

        {/* Mobile Fixed Bottom Navigation Bar with Prominent FindIt Emphasis */}
        <BottomNav currentRoute={currentRoute} onNavigate={navigateTo} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <FindItProvider>
      <AppContent />
    </FindItProvider>
  );
}
