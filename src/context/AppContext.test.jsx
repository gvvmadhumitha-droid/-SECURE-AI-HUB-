import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AppProvider, useApp } from './AppContext';
import React from 'react';

// Mock localStorage to prevent cross-test contamination
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('AppContext Business Logic', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>;

  it('calculates readiness score correctly based on simulations', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    // Initial state
    expect(result.current.readinessScore).toBe(0);
    
    // Add sessions
    act(() => {
      result.current.addSimulatorSession({ score: 80, risk_profile: 'target', scenario: 'test' });
      result.current.addSimulatorSession({ score: 100, risk_profile: 'resilient', scenario: 'test 2' });
    });
    
    expect(result.current.readinessScore).toBe(90);
  });

  it('determines the correct risk profile', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    expect(result.current.getRiskProfile()).toBe('new_user');
    
    act(() => {
      result.current.addSimulatorSession({ score: 40, risk_profile: 'vulnerable', scenario: 'A' });
      result.current.addSimulatorSession({ score: 50, risk_profile: 'vulnerable', scenario: 'B' });
      result.current.addSimulatorSession({ score: 90, risk_profile: 'resilient', scenario: 'C' });
    });
    
    expect(result.current.getRiskProfile()).toBe('vulnerable');
  });

  it('generates a verified judge report', () => {
    const { result } = renderHook(() => useApp(), { wrapper });
    
    act(() => {
      result.current.addSimulatorSession({ score: 85, risk_profile: 'resilient', scenario: 'A' });
      result.current.completePreQuiz(2);
      result.current.completePostQuiz(5);
      result.current.toggleHygieneTask('task1');
    });
    
    const report = result.current.generateJudgeReport();
    
    expect(report.metrics.totalSims).toBe(1);
    expect(report.metrics.avgScore).toBe(85);
    expect(report.metrics.improvement).toBe(3);
    expect(report.metrics.hygieneCount).toBe(1);
    expect(report.summary).toContain('1 simulations with 85% resilience');
    expect(report.summary).toContain('Improved baseline awareness by 3');
  });
});
