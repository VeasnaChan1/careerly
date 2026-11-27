import { useState } from 'react';
import { interviewCategories, interviewQuestions } from '../data/interviewQuestions.js';

const focusStyle = 'focus-visible:outline-2 focus-visible:outline-[#F46200]';

const categories = interviewCategories.map((category) => ({
  ...category,
  questions: interviewQuestions.filter((question) => question.category === category.id),
}));

function QuestionDetails({ question }) {
  return (
    <div className="max-w-3xl space-y-5 text-sm leading-6 text-[#5A554E]">
      <div>
        <h4 className="font-semibold text-[#2D2D2D]">
          {question.sampleAnswer ? 'How to answer' : 'Why to ask and what to listen for'}
        </h4>
        <p className="mt-1">{question.guidance}</p>
      </div>

      {question.sampleAnswer && (
        <div className="rounded-xl border border-[#F0DDD0] bg-[#FFF8F2] px-4 py-3 sm:px-5 sm:py-4">
          <h4 className="font-semibold text-[#2D2D2D]">{question.category === 'technical' ? 'Example explanation' : 'Sample answer'}</h4>
          <p className="mt-2 whitespace-pre-line text-[#3E3730]">{question.sampleAnswer}</p>
          {question.category !== 'technical' && (
            <p className="mt-3 text-xs text-[#655A50]">Use this example as a guide and share details from your own experience.</p>
          )}
        </div>
      )}

      <div>
        <h4 className="font-semibold text-[#2D2D2D]">{question.category === 'employer' ? 'Follow-up tips' : 'Practice tips'}</h4>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          {question.tips.map((tip) => <li key={tip}>{tip}</li>)}
        </ul>
      </div>
    </div>
  );
}

function CategoryQuestions({ category }) {
  const { questions } = category;
  const [openQuestion, setOpenQuestion] = useState(questions[0]?.id);

  return (
    <section aria-labelledby="interview-category-heading" className="min-w-0 rounded-2xl border border-[#E7E2D8] bg-white shadow-xs">
      <header className="border-b border-[#E7E2D8] px-4 py-5 sm:px-6">
        <h2 id="interview-category-heading" className="text-xl font-bold tracking-tight">{category.label}</h2>
        <p className="mt-1 text-sm leading-6 text-[#5A554E]">{category.description}</p>
      </header>

      {questions.length ? (
        <ul className="divide-y divide-[#E7E2D8]">
          {questions.map((question) => {
            const isOpen = openQuestion === question.id;
            const panelId = `${question.id}-details`;
            const detailLabel = question.sampleAnswer ? 'answer' : 'guidance';

            return (
              <li key={question.id}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenQuestion(isOpen ? null : question.id)}
                    className={`flex w-full cursor-pointer flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-4 text-left hover:bg-[#FAF8F4] focus-visible:outline-offset-[-2px] sm:px-6 ${focusStyle} ${isOpen ? 'bg-[#FAF8F4]' : ''}`}
                  >
                    <span className="min-w-0 flex-1 basis-44 text-sm font-semibold leading-6 sm:text-base">
                      {question.question}
                      {category.id === 'technical' && (
                        <span className="block text-xs font-medium leading-5 text-[#655A50]">{question.tags.join(', ')}</span>
                      )}
                    </span>
                    <span aria-hidden="true" className="shrink-0 rounded-md bg-[#FFF0E5] px-2.5 py-1 text-xs font-semibold text-[#AD4500]">
                      {isOpen ? 'Hide' : 'View'} {detailLabel}
                    </span>
                  </button>
                </h3>
                <div id={panelId} hidden={!isOpen} className="border-t border-[#E7E2D8] px-4 py-5 sm:px-6">
                  {isOpen && <QuestionDetails question={question} />}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="px-4 py-5 sm:px-6">
          <p className="text-sm text-[#5A554E]">There are no questions in this category yet.</p>
        </div>
      )}
    </section>
  );
}

export default function InterviewPrep() {
  const [category, setCategory] = useState(categories[0]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#FAF8F4] text-[#2D2D2D]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="mb-7 sm:mb-9">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Interview Prep</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[#5A554E] sm:text-base">
            Practice common interview questions and prepare questions to ask employers.
          </p>
        </header>

        <div className="grid items-start gap-5 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-7">
          <section aria-labelledby="interview-categories-heading">
            <h2 id="interview-categories-heading" className="mb-3 text-sm font-semibold">Categories</h2>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
              {categories.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-pressed={category.id === item.id}
                    onClick={() => setCategory(item)}
                    className={`flex h-full min-h-12 w-full cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors ${focusStyle} ${
                      category.id === item.id
                        ? 'border-[#F7BB95] bg-[#FFF0E5] text-[#AD4500]'
                        : 'border-[#E7E2D8] bg-white text-[#5A554E] hover:border-[#F7BB95]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="shrink-0 text-xs tabular-nums">{item.questions.length}<span className="sr-only"> questions</span></span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <CategoryQuestions key={category.id} category={category} />
        </div>
      </div>
    </main>
  );
}
