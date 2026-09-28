import React from "react";
import { schoolEducation, universityEducation, schoolInfo, EducationRecord } from "../data/education";
import { GraduationCap, Building2, BookOpen, CheckCircle2 } from "lucide-react";

export interface AcademicRecordProps {
  className?: string;
  includeUniversity?: boolean;
}

/**
 * AcademicRecord Component
 * 
 * Unified, single-widget presentation of verified academic history:
 * 1. University Education (KIIT - B.Tech CSE AI & ML)
 * 2. School Education & CBSE Board Examination Results (Class 12 & Class 10)
 * 
 * Strictly adheres to verified data:
 * - No fake marksheets or mock verification links
 * - Exact CBSE subjects list (wrapping pills, no truncation)
 * - Science stream for Class 12 (no PCM label)
 * - Restrained percentage display with tabular numerals
 */
export function AcademicRecord({ className = "", includeUniversity = true }: AcademicRecordProps) {
  return (
    <section className={`academic-record w-full space-y-6 font-sans ${className}`} aria-labelledby="academic-record-heading">
      {/* 1. Header */}
      <div className="academic-record-header space-y-1.5 pb-2 border-b border-zinc-200 dark:border-zinc-850">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase">
            ACADEMICS
          </span>
          <span className="text-zinc-300 dark:text-zinc-700" aria-hidden="true">·</span>
          <span className="text-[11px] font-mono text-zinc-500">
            Verified Educational History
          </span>
        </div>
        <h2 id="academic-record-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-display">
          Academic Record
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Higher education and secondary board examination results from verified academic institutions.
        </p>
      </div>

      {/* 2. University Stage (KIIT) */}
      {includeUniversity && (
        <article className="university-record rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 p-5 sm:p-7 space-y-4 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold">
              <Building2 className="w-4 h-4" />
              <span>UNIVERSITY EDUCATION</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-300 font-medium">
              {universityEducation.status}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white font-display">
                {universityEducation.degree}
              </h3>
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                {universityEducation.institution}
              </p>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed pt-1">
                {universityEducation.description} Specialization in{" "}
                <span className="text-zinc-900 dark:text-zinc-200 font-medium">{universityEducation.specialization}</span>.
              </p>
            </div>

            <div className="lg:col-span-4 grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-850 text-center">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">First-Year CGPA</span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5 font-display tabular-nums">
                  {universityEducation.cgpa}
                </span>
                <span className="text-[9px] font-mono text-zinc-400 block">
                  Scale of {universityEducation.cgpaScale}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-zinc-850 text-center">
                <span className="text-[10px] uppercase font-mono text-zinc-500 block">Graduation</span>
                <span className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white block mt-0.5 font-display tabular-nums">
                  {universityEducation.expectedGraduation}
                </span>
                <span className="text-[9px] font-mono text-zinc-400 block">
                  Expected Completion
                </span>
              </div>
            </div>
          </div>
        </article>
      )}

      {/* 3. School Education Widget (Class 12 & Class 10 unified parent widget) */}
      <div className="school-education-widget rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 p-5 sm:p-7 space-y-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-850 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400">
              <GraduationCap className="w-4 h-4 text-purple-500" />
              <span className="font-bold text-zinc-900 dark:text-white tracking-wider">ACADEMIC RECORD</span>
              <span className="text-zinc-300 dark:text-zinc-700" aria-hidden="true">·</span>
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">{schoolInfo.name}</span>
            </div>
            <p className="text-xs text-zinc-500 font-sans">
              School education and board examination results
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 font-medium inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Official CBSE Board Record
          </span>
        </div>

        {/* Two-column side-by-side on desktop, single column on mobile */}
        <div className="academic-record-list grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
          {schoolEducation.map((record: EducationRecord) => {
            const isClass12 = record.id === "cbse-class-12";

            return (
              <article
                key={record.id}
                className="academic-record-item flex flex-col justify-between p-5 sm:p-6 rounded-xl border border-zinc-200 dark:border-zinc-800/90 bg-zinc-50/70 dark:bg-zinc-950/40 space-y-5"
              >
                {/* Meta Header */}
                <div className="space-y-3">
                  <div className="academic-record-meta flex items-center justify-between gap-2 text-xs font-mono">
                    <span className="font-bold text-purple-700 dark:text-purple-400 tracking-wider">
                      {isClass12 ? "CLASS 12" : "CLASS 10"}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium tabular-nums border border-zinc-300/60 dark:border-zinc-700/60">
                      Session: {record.session}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white font-display">
                      {record.title}
                    </h3>
                    <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-0.5">
                      {record.institution} ({record.board})
                    </p>
                  </div>

                  {/* Score & Stream Strip */}
                  <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-white dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-850">
                    <div className="academic-record-score flex items-baseline gap-2">
                      <span className="text-xs font-mono uppercase text-zinc-500">Overall</span>
                      <strong className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400 font-display tabular-nums">
                        {record.percentage}
                      </strong>
                    </div>

                    {record.stream && (
                      <span className="academic-stream text-xs font-mono px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40 font-semibold">
                        {record.stream} Stream
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="academic-description text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
                    {record.description}
                  </p>
                </div>

                {/* Subjects Section: Clean wrapping pills, visible directly */}
                <div className="space-y-2.5 pt-3 border-t border-zinc-200/80 dark:border-zinc-850">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                      Subjects ({record.subjects.length})
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Official CBSE Board Record
                    </span>
                  </div>

                  <div className="academic-subjects flex flex-wrap gap-1.5 pt-0.5">
                    {record.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="px-2.5 py-1 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-700 dark:text-zinc-300 leading-tight"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AcademicRecord;
