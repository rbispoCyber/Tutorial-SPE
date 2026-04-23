import React, { useState } from 'react';

// Tipagem dos dados de cada passo do tutorial
interface TutorialStep {
  id: number;
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
}

export default function SpeTutorial() {
  // Controle de qual passo está aberto. Inicia com o passo 1 aberto.
  const [activeStep, setActiveStep] = useState<number | null>(1);

  // Função para abrir/fechar as abas
  const toggleStep = (id: number) => {
    setActiveStep(activeStep === id ? null : id);
  };

  // Conteúdo exato dos passos
  const steps: TutorialStep[] = [
    {
      id: 1,
      title: '1. Acesse o portal da SPE International',
      description: 'O primeiro passo é criar sua conta global. Acesse o site oficial da Society of Petroleum Engineers e clique em "Join SPE" na área de estudantes.',
      actionText: 'Acessar Site Oficial',
      actionLink: 'https://www.spe.org/en/join/'
    },
    {
      id: 2,
      title: '2. Preencha seus Dados Acadêmicos',
      description: 'Durante o cadastro, você precisará informar seus dados universitários. Na seção "University/College", busque por "Universidade Federal do Pará (UFPA)". Certifique-se de preencher corretamente seu curso e a data prevista de formatura.'
    },
    {
      id: 3,
      title: '3. Isenção da Anuidade (Student Dues)',
      description: 'A SPE possui um programa de patrocínio corporativo (geralmente patrocinado pela Chevron) que cobre o custo da anuidade para estudantes. Na tela de pagamento, selecione a opção de ter sua anuidade paga pelo programa de patrocínio para finalizar a inscrição gratuitamente.'
    },
    {
      id: 4,
      title: '4. Conecte-se ao Capítulo Estudantil',
      description: 'Com o seu SPE ID gerado, procure a diretoria do Capítulo Estudantil local para validar sua associação na universidade e começar a participar dos eventos, minicursos e projetos.'
    }
  ];

  return (
    <div style={{ 
      maxWidth: '700px', 
      margin: '40px auto', 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      padding: '20px',
      color: '#333'
    }}>
      
      {/* Cabeçalho */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ color: '#0055A4', fontSize: '2rem', marginBottom: '15px' }}>
          Como se tornar membro da SPE
        </h1>
        <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
          Siga o passo a passo abaixo para realizar sua inscrição oficial e garantir sua vaga no capítulo estudantil da UFPA.
        </p>
      </div>

      {/* Container do Acordeão */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {steps.map((step) => {
          const isActive = activeStep === step.id;

          return (
            <div 
              key={step.id} 
              style={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: '8px', 
                overflow: 'hidden',
                boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.3s ease'
              }}
            >
              {/* Botão que controla o Acordeão */}
              <button
                onClick={() => toggleStep(step.id)}
                style={{
                  width: '100%',
                  padding: '20px',
                  backgroundColor: isActive ? '#f8fbff' : '#ffffff',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  color: isActive ? '#0055A4' : '#333',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.2s'
                }}
              >
                {step.title}
                <span style={{ 
                  fontSize: '1.5rem', 
                  color: isActive ? '#0055A4' : '#999',
                  fontWeight: '300',
                  transform: isActive ? 'rotate(45deg)' : 'rotate(0)',
                  transition: 'transform 0.3s ease'
                }}>
                  +
                </span>
              </button>

              {/* Conteúdo Expansível */}
              {isActive && (
                <div style={{ 
                  padding: '0 20px 20px 20px', 
                  backgroundColor: '#f8fbff',
                  animation: 'fadeIn 0.3s ease-in'
                }}>
                  <p style={{ margin: '0 0 20px 0', color: '#444', lineHeight: '1.6', fontSize: '1rem' }}>
                    {step.description}
                  </p>
                  
                  {/* Renderiza o botão de ação apenas se existir link no passo */}
                  {step.actionLink && step.actionText && (
                    <a 
                      href={step.actionLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        backgroundColor: '#0055A4',
                        color: '#ffffff',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        transition: 'background-color 0.2s',
                        boxShadow: '0 2px 4px rgba(0, 85, 164, 0.2)'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#004080'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0055A4'}
                    >
                      {step.actionText}
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
