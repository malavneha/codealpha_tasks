import { BrainCircuit, Languages } from 'lucide-react';
import { Link, useLocation } from 'wouter';

export function TaskNavigation() {
  const [location] = useLocation();

  return (
    <nav
      className="flex flex-wrap items-center gap-1 rounded-2xl border border-border/80 bg-card/75 p-1 shadow-[0_8px_24px_rgba(39,69,70,0.06)] backdrop-blur-sm"
      aria-label="Internship task navigation"
      data-testid="task-navigation"
    >
      <Link
        href="/"
        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
          location === '/' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-primary'
        }`}
        data-testid="link-language-translator"
      >
        <Languages size={15} aria-hidden="true" />
        <span>Language Translator</span>
      </Link>
      <Link
        href="/faq-chatbot"
        className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-colors ${
          location === '/faq-chatbot'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-secondary hover:text-primary'
        }`}
        data-testid="link-faq-chatbot"
      >
        <BrainCircuit size={15} aria-hidden="true" />
        <span>FAQ Chatbot</span>
      </Link>
    </nav>
  );
}