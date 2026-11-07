import React from 'react';
import { Cpu, CheckCircle2 } from 'lucide-react';

export default function AboutProject() {
  const steps = [
    { num: '1', title: 'Input Specimen', desc: 'Preprocessed and validated for avian characteristics.' },
    { num: '2', title: 'Multimodal Neural Analysis', desc: 'Deep vision and bioacoustic analysis extract taxonomic features.' },
    { num: '3', title: 'Species Classification', desc: 'High-confidence species classification calibrated across 100 classes.' },
    { num: '4', title: 'Species Output', desc: 'Returns top predicted bird species with complete 6-section biological profile.' },
  ];

  const tech = [
    { name: 'React 18', desc: 'Frontend UI' },
    { name: 'Tailwind CSS', desc: 'Modern styling' },
    { name: 'FastAPI', desc: 'Python API server' },
    { name: 'Multimodal AI API', desc: 'Vision and bioacoustics' },
    { name: 'MongoDB', desc: 'Telemetry & history storage' },
  ];

  return (
      <div className="space-y-6 max-w-4xl mx-auto pb-12">
        <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              About Project
            </h2>
              <p className="text-xs text-slate-500 mt-1">
                Deep learning classification system for Indian and global bird species.
              </p>
            </div>

              {/* Overview & Objectives */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-semibold text-sm text-slate-900">Project Overview</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  This project classifies bird species from images and bioacoustic recordings using multimodal deep learning and provides structured biological details such as scientific name, family, habitat, diet, and IUCN conservation status.
                </p>

                      <div className="pt-2">
                        <h4 className="font-semibold text-xs text-slate-800 mb-2">Key Objectives</h4>
                        <ul className="text-xs text-slate-600 space-y-1.5">
                          <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>Automate bird species identification from uploaded images.</span>
                          </li>
                            <li className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span>Dynamic avian species coverage with real-time biological and conservation intelligence.</span>
                            </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                <span>Provide an accessible, clean web application interface.</span>
                              </li>
                            </ul>
                          </div>
                      </div>

                                {/* Pipeline */}
                                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                                  <h3 className="font-semibold text-sm text-slate-900">Classification Pipeline</h3>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {steps.map((s) => (
                                      <div key={s.num} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                                          {s.num}
                                        </span>
                                        <div>
                                          <span className="font-semibold text-xs text-slate-800 block">{s.title}</span>
                                          <span className="text-[11px] text-slate-500 mt-0.5 block leading-relaxed">{s.desc}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                        {/* Tech Stack */}
                                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                                          <h3 className="font-semibold text-sm text-slate-900">Technologies Used</h3>
                                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {tech.map((t) => (
                                              <div key={t.name} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                                <span className="font-semibold text-xs text-slate-800 block">{t.name}</span>
                                                <span className="text-[11px] text-slate-500 block mt-0.5">{t.desc}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    );
}
