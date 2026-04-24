import React, { useState, useRef, useEffect } from 'react';
import SphereBg from './SphereBg';

interface TutorialStep {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  Icon: React.FC<{ active: boolean }>;
}

/* ── Interactive Icons (MovieMotion) ── */
const IconPortal = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" 
       style={{ transform: active ? 'rotate(12deg) scale(1.15)' : 'rotate(0deg) scale(1)', transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconAcademic = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
       style={{ transform: active ? 'translateY(-3px) scale(1.15)' : 'translateY(0) scale(1)', transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const IconPrice = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
       style={{ transform: active ? 'rotate(-10deg) scale(1.15)' : 'rotate(0deg) scale(1)', transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
    <path d="M12 2v20" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const IconUsers = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
       style={{ transform: active ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const steps: TutorialStep[] = [
  {
    id: 1,
    eyebrow: 'Passo 01',
    title: 'Acesse o portal da SPE International',
    description:
      'O primeiro passo é criar sua conta global. Acesse o site oficial da Society of Petroleum Engineers e clique em "Join SPE" na área de estudantes.',
    actionText: 'Acessar Site Oficial →',
    actionLink: 'https://www.spe.org/en/join/',
    Icon: IconPortal,
  },
  {
    id: 2,
    eyebrow: 'Passo 02',
    title: 'Preencha seus Dados Acadêmicos',
    description:
      'Durante o cadastro, você precisará informar seus dados universitários. Na seção "University/College", busque por "Universidade Federal do Pará (UFPA)". Certifique-se de preencher corretamente seu curso e a data prevista de formatura.',
    Icon: IconAcademic,
  },
  {
    id: 3,
    eyebrow: 'Passo 03',
    title: 'Isenção da Anuidade (Student Dues)',
    description:
      'A SPE possui um programa de patrocínio corporativo (geralmente patrocinado pela Chevron) que cobre o custo da anuidade para estudantes. Na tela de pagamento, selecione a opção de ter sua anuidade paga pelo programa de patrocínio e finalize gratuitamente.',
    Icon: IconPrice,
  },
  {
    id: 4,
    eyebrow: 'Passo 04',
    title: 'Conecte-se ao Capítulo Estudantil',
    description:
      'Com o seu SPE ID gerado, procure a diretoria do Capítulo Estudantil local para validar sua associação na universidade e começar a participar dos eventos, minicursos e projetos.',
    actionText: 'Siga nosso Instagram →',
    actionLink: 'https://www.instagram.com/spe.ufpa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    Icon: IconUsers,
  },
];

/* ── Smooth accordion ── */
function AccordionPanel({ children, open }: { children: React.ReactNode; open: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    setHeight(open ? ref.current.scrollHeight : 0);
  }, [open]);
  return (
    <div style={{ overflow: 'hidden', height, transition: 'height 0.38s cubic-bezier(0.4,0,0.2,1)' }}>
      <div ref={ref}>{children}</div>
    </div>
  );
}

/* ── Chevron ── */
function Chevron({ open }: { open: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 12 12" fill="none"
      style={{ transform: open ? 'rotate(180deg) translateY(1.5px)' : 'rotate(0) translateY(0)', transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
      <path d="M2 4.5L6 8L10 4.5" stroke={open ? '#003DA5' : '#8a9bb5'}
        strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── Horizontal rule ── */
function Rule({ color = 'rgba(0, 61, 165,0.12)' }: { color?: string }) {
  return <div style={{ width: '100%', height: '1px', background: color }} />;
}

export default function SpeTutorial() {
  const [activeStep, setActiveStep] = useState<number | null>(1);
  const toggle = (id: number) => setActiveStep(p => p === id ? null : id);


  return (
    <>
      <SphereBg />

      {/* ── CSS Animations for Loading Effect ── */}
      <style>{`
        @keyframes fadeUpPage {
          0% { opacity: 0; transform: translateY(20px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }
        @keyframes fadeNav {
          0% { opacity: 0; transform: translateY(-15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .action-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #ffffff;
          text-decoration: none;
          padding: 10px 22px;
          border-radius: 99px;
          background: linear-gradient(135deg, rgba(0,61,165,0.9), rgba(0,42,122,0.95));
          border: 1.5px solid rgba(255,255,255,0.1);
          box-shadow: 0 4px 15px rgba(0, 61, 165, 0.25), inset 0 2px 0 rgba(255,255,255,0.15);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .action-link:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 61, 165, 0.4), inset 0 2px 0 rgba(255,255,255,0.25);
          color: #ffffff;
          border: 1.5px solid rgba(255,255,255,0.25);
        }
        .action-link:active {
          transform: translateY(1px);
          box-shadow: 0 2px 8px rgba(0, 61, 165, 0.2), inset 0 2px 0 rgba(255,255,255,0.1);
        }
      `}</style>

      {/* ── Fixed Top Navbar with SPE Logo ── */}
      <nav style={{
        animation: 'fadeNav 1.2s ease-out 0.8s both',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10,
        display: 'flex', alignItems: 'center',
        padding: '0 28px',
        height: '96px',
        background: 'rgba(255,255,255,0.70)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(0, 61, 165,0.10)',
        boxShadow: '0 1px 12px rgba(0, 42, 122,0.07)',
      }}>
        {/* SPE Logo — official mark */}
        <a href="https://www.spe.org" target="_blank" rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src="/spe-ufpa-logo.png"
            alt="SPE UFPA Student Chapter Logo"
            style={{ height: '80px', objectFit: 'contain' }}
          />
        </a>
      </nav>

      {/* ── Page wrapper ── */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: '100%', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '136px 24px 100px',   /* top: 136px to clear the 96px navbar */
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>

        {/* ─────── Hero header ─────── */}
        <header style={{
          animation: 'fadeUpPage 1.2s cubic-bezier(0.2,0.8,0.2,1) 1.0s both',
          width: '100%', maxWidth: '720px',
          textAlign: 'center', marginBottom: '56px',
        }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '5px 14px', borderRadius: '999px',
            border: '1.5px solid rgba(0, 61, 165,0.30)',
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(8px)',
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.09em',
            textTransform: 'uppercase', color: '#003DA5',
            marginBottom: '24px',
            boxShadow: '0 1px 4px rgba(0, 61, 165,0.10)',
          }}>
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: '#003DA5',
              boxShadow: '0 0 6px 2px rgba(0, 61, 165,0.45)',
            }} />
            Capítulo Estudantil · UFPA
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(1.9rem, 5vw, 3rem)',
            fontWeight: 700, letterSpacing: '-0.03em',
            color: '#FFFFFF', lineHeight: 1.12,
            marginBottom: '16px',
            textShadow: '0 4px 24px rgba(0,0,0,0.4)', // Soft shadow to lift it off the background
          }}>
            Como se tornar{' '}
            <span style={{
              fontFamily: "'EB Garamond', Georgia, serif",
              fontStyle: 'italic', fontWeight: 500,
              color: '#82C3FF', /* Icy bright blue for high contrast */
            }}>
              membro da SPE
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '1.05rem', color: 'white',
            maxWidth: '520px', lineHeight: 1.7, margin: '0 auto',
          }}>
            Siga o passo a passo abaixo para realizar sua inscrição oficial e garantir
            sua vaga no capítulo estudantil da UFPA.
          </p>
        </header>

        {/* ─────── Accordion card ─────── */}
        <div style={{
          animation: 'fadeUpPage 1.2s cubic-bezier(0.2,0.8,0.2,1) 1.2s both',
          width: '100%', maxWidth: '720px',
          background: 'rgba(255,255,255,0.80)',
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 61, 165,0.12)',
          boxShadow: '0 4px 24px rgba(0, 42, 122,0.08), 0 1px 4px rgba(0, 42, 122,0.06)',
          overflow: 'hidden',
        }}>
          {steps.map((step, idx) => {
            const isActive = activeStep === step.id;
            return (
              <div key={step.id}>
                {idx > 0 && <Rule />}

                <div
                  onClick={() => toggle(step.id)}
                  style={{
                    padding: '22px 28px',
                    cursor: 'pointer', userSelect: 'none',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(0, 61, 165,0.05) 0%, rgba(0, 61, 165,0.02) 100%)'
                      : 'transparent',
                    transition: 'background 0.25s',
                  }}
                >
                  {/* Header row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    {/* Left side with animated custom icon */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '18px' }}>
                      {/* Icon container */}
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '52px', height: '52px', borderRadius: '15px', flexShrink: 0,
                        background: isActive ? 'linear-gradient(135deg, rgba(0, 61, 165,0.12) 0%, rgba(0, 42, 122,0.06) 100%)' : 'rgba(0, 61, 165,0.03)',
                        color: isActive ? '#003DA5' : '#8a9bb5',
                        boxShadow: isActive ? '0 8px 18px rgba(0, 61, 165,0.14), inset 0 1px 0 rgba(255,255,255,0.7)' : 'none',
                        border: isActive ? '1px solid rgba(0, 61, 165,0.25)' : '1px solid rgba(0,55,164,0.0)',
                        transform: isActive ? 'translateY(-2px)' : 'translateY(0)',
                        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      }}>
                        <step.Icon active={isActive} />
                      </div>
                      
                      {/* Texts */}
                      <div>
                        <p style={{
                          fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: isActive ? '#003DA5' : '#8a9bb5',
                          marginBottom: '3px', transition: 'color 0.25s',
                        }}>
                          {step.eyebrow}
                        </p>
                        <h2 style={{
                          fontSize: 'clamp(0.95rem, 2.5vw, 1.08rem)',
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? '#002A7A' : '#4a5568',
                          letterSpacing: '-0.01em', lineHeight: 1.35,
                          transition: 'color 0.25s, font-weight 0.25s',
                        }}>
                          {step.title}
                        </h2>
                      </div>
                    </div>

                    {/* Chevron button */}
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      border: `1.5px solid ${isActive ? 'rgba(0, 61, 165,0.35)' : 'rgba(0, 61, 165,0.14)'}`,
                      background: isActive ? 'rgba(0, 61, 165,0.08)' : 'rgba(255,255,255,0.60)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: isActive ? '0 0 0 4px rgba(0, 61, 165,0.06)' : 'none',
                      transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}>
                      <Chevron open={isActive} />
                    </div>
                  </div>

                  {/* Body */}
                  <AccordionPanel open={isActive}>
                    <div style={{ paddingTop: '12px', paddingRight: '46px' }}>
                      <p style={{
                        fontSize: '0.94rem', color: '#4a5568', lineHeight: 1.72,
                        marginBottom: step.actionLink ? '18px' : '4px',
                      }}>
                        {step.description}
                      </p>

                      {step.actionLink && step.actionText && (
                        <a
                          href={step.actionLink}
                          target="_blank" rel="noopener noreferrer"
                          className="action-link"
                          style={{ marginTop: '6px' }}
                        >
                          {step.actionText}
                        </a>
                      )}
                    </div>
                  </AccordionPanel>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─────── Footer (Contact / Help) ─────── */}
        <div style={{
          marginTop: '40px', padding: '28px 32px',
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(16px)', borderRadius: '16px',
          border: '1px solid rgba(0, 61, 165, 0.1)',
          boxShadow: '0 4px 24px rgba(0, 61, 165, 0.05)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
          textAlign: 'center', maxWidth: '720px', width: '100%',
          animation: 'fadeUpPage 1s cubic-bezier(0.2,0.8,0.2,1) 1.3s both',
        }}>
          <div>
            <h3 style={{ fontSize: '1.10rem', color: '#002A7A', marginBottom: '6px', fontWeight: 600 }}>Dúvidas sobre o processo?</h3>
            <p style={{ fontSize: '0.90rem', color: '#4a5568', lineHeight: 1.5 }}>
              A diretoria do capítulo estudantil da UFPA está pronta para te ajudar. Fale conosco!
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
             <a href="https://www.instagram.com/spe.ufpa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank" rel="noopener noreferrer"
                className="action-link">
               <svg style={{ transform: 'translateY(1px)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                 <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                 <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
               </svg>
               Acessar Instagram
             </a>
             <a href="mailto:ufpaspe@gmail.com"
                className="action-link"
                style={{ background: 'rgba(255, 255, 255, 0.8)', color: '#003DA5', border: '1.5px solid rgba(0, 61, 165, 0.25)', boxShadow: '0 4px 15px rgba(0, 61, 165, 0.05)' }}>
               <svg style={{ transform: 'translateY(1px)' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                 <polyline points="22,6 12,13 2,6"></polyline>
               </svg>
               Enviar E-mail
             </a>
          </div>
        </div>
      </div>
    </>
  );
}
