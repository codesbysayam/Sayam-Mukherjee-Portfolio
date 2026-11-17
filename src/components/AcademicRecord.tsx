import React from "react";
import { schoolEducation, universityEducation, schoolInfo, EducationRecord } from "../data/education";
import { GraduationCap, Building2, BookOpen, CheckCircle2 } from "lucide-react";

export interface AcademicRecordProps {
  className?: string;
  includeUniversity?: boolean;
}

export function AcademicRecord({ className = "", includeUniversity = true }: AcademicRecordProps) {
  return (
    <section className={`academic-record w-full space-y-6 font-sans ${className}`} aria-labelledby="academic-record-heading">
      {/* 1. Header */}
      <div className="academic-record-header space-y-1.5 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="font-semibold tracking-wider text-[var(--accent)] uppercase">
            Academics
          </span>
          <span className="text-[var(--text-faint)]" aria-hidden="true">·</span>
          <span className="text-[var(--text-muted)]">
            Verified Educational History
          </span>
        </div>
        <h2 id="academic-record-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)] font-display">
          Academic Record
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          Higher education and secondary board examination results from verified academic institutions.
        </p>
      </div>

      {/* 2. University Stage (KIIT) */}
      {includeUniversity && (
        <article className="card p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-[var(--accent)] font-semibold uppercase tracking-wider">
              <Building2 className="w-4 h-4" aria-hidden="true" />
              <span>University Education</span>
            </div>
            <span className="px-2.5 py-1 rounded-[4px] bg-[#C7E34A] text-[#20231D] font-bold text-[11px] tracking-wide">
              {universityEducation.status}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-[var(--text)] font-display">
                {universityEducation.degree}
              </h3>
              <p className="text-xs font-mono text-[var(--text-muted)]">
                {universityEducation.institution}
              </p>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pt-1">
                {universityEducation.description} Specialization in{" "}
                <span className="text-[var(--text)] font-semibold">{universityEducation.specialization}</span>.
              </p>
            </div>

            <div className="lg:col-span-4 grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] text-center">
                <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] block">First-Year CGPA</span>
                <span className="text-xl sm:text-2xl font-extrabold text-[var(--text)] block mt-0.5 font-display tabular-nums">
                  {universityEducation.cgpa}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                  Scale of {universityEducation.cgpaScale}
                </span>
              </div>

              <div className="p-3.5 rounded-[8px] bg-[var(--surface)] border border-[var(--border)] text-center">
                <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] block">Graduation</span>
                <span className="text-lg sm:text-xl font-extrabold text-[var(--text)] block mt-0.5 font-display tabular-nums">
                  {universityEducation.expectedGraduation}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)] block">
                  Expected Completion
                </span>
              </div>
            </div>
          </div>
        </article>
      )}

      {/* 3. School Education Widget (Class 12 & Class 10) */}
      <div className="card p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[var(--text-muted)]">
              <GraduationCap className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
              <span className="font-bold text-[var(--text)] tracking-wider uppercase">School Record</span>
              <span aria-hidden="true">·</span>
              <span className="text-[var(--text-secondary)] font-medium">{schoolInfo.name}</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-sans">
              School education and CBSE board examination results
            </p>
          </div>
          <span className="text-[11px] font-mono text-[var(--accent)] font-semibold inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
            Official CBSE Board Record
          </span>
        </div>

        <div className="academic-record-list grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
          {schoolEducation.map((record: EducationRecord) => {
            const isClass12 = record.id === "cbse-class-12";

            return (
              <article
                key={record.id}
                className="flex flex-col justify-between p-5 sm:p-6 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs font-mono">
                    <span className="font-bold text-[var(--accent)] tracking-wider uppercase">
                      {isClass12 ? "Class 12" : "Class 10"}
                    </span>
                    <span className="text-[var(--text-muted)] tabular-nums">
                      Session {record.session}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[var(--text)] font-display">
                      {record.title}
                    </h3>
                    <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
                      {record.institution} ({record.board})
                    </p>
                  </div>

                  {/* Score & Stream Strip */}
                  <div className="flex items-center justify-between gap-4 p-3.5 rounded-[8px] bg-[var(--surface-2)] border border-[var(--border)]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Overall</span>
                      <strong className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] font-display tabular-nums">
                        {record.percentage}
                      </strong>
                    </div>

                    {record.stream && (
                      <span className="text-xs font-mono text-[var(--accent)] font-semibold">
                        {record.stream} Stream
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                    {record.description}
                  </p>
                </div>

                {/* Subjects List */}
                <div className="space-y-2.5 pt-3 border-t border-[var(--border)]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                    <span className="uppercase tracking-wider font-semibold flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[var(--accent)]" aria-hidden="true" />
                      Subjects ({record.subjects.length})
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {record.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="px-2.5 py-1 rounded-[4px] bg-[var(--surface-2)] border border-[var(--border)] text-[11px] font-mono text-[var(--text-secondary)] leading-tight"
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
