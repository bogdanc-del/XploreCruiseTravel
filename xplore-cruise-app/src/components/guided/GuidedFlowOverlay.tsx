'use client'

import React from 'react'
import { useGuidedFlow } from '@/context/GuidedFlowContext'
import GuidedModal from './GuidedModal'
import GuidedResults from './GuidedResults'

// ============================================================
// GuidedFlowOverlay — renders in root layout
// Shows GuidedModal during steps, GuidedResults when complete
// ============================================================

export default function GuidedFlowOverlay() {
  const { state, isOpen } = useGuidedFlow()

  // Show results page when flow is complete and modal was open
  if (state.isComplete && state.currentStep === 6) {
    return <GuidedResults />
  }

  // Show modal during steps
  if (isOpen) {
    return <GuidedModal />
  }

  return null
}
