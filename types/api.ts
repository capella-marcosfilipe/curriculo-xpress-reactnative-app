// types/api.ts

/**
 * Tipos baseados na resposta real da API
 * GET /api/curriculums/:id
 */

// ============ BLOCOS DO CURRÍCULO ============

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string; // ISO 8601
  endDate: string | null; // Pode ser null se ainda está cursando
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  description: string;
  startDate: string; // Formato: "YYYY-MM-DD"
  endDate: string | null; // Pode ser null se ainda trabalha lá
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  level: string | null; // Backend retorna null, mas pode ter níveis no futuro
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string | null; // Pode ser null
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Statement {
  id: string;
  title: string;
  text: string; // Conteúdo do statement/resumo
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// ============ CURRÍCULO COMPLETO ============

export interface Curriculum {
  id: string; // UUID
  title: string;
  userId: string;
  statementId: string;
  createdAt: string;
  updatedAt: string;
  
  // Relacionamentos (sempre presentes quando buscar um currículo específico)
  statement: Statement;
  educations: Education[];
  experiences: Experience[];
  skills: Skill[];
  projects: Project[];
}

// ============ TIPOS PARA LISTAGEM ============

/**
 * Tipo para a listagem simplificada de currículos
 * (quando GET /api/curriculums pode não retornar todos os relacionamentos)
 */
export interface CurriculumListItem {
  id: string;
  title: string;
  userId: string;
  statementId: string;
  createdAt: string;
  updatedAt: string;
  statement: Statement;
  // Podem estar presentes ou não na listagem
  educations?: Education[];
  experiences?: Experience[];
  skills?: Skill[];
  projects?: Project[];
}

// ============ TIPOS PARA CRIAÇÃO ============

export interface CreateCurriculumPayload {
  statementId: string;
  title?: string;
}

export interface CreateStatementPayload {
  title: string;
  text: string;
}

export interface CreateEducationPayload {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string | null;
}

export interface CreateExperiencePayload {
  company: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string | null;
}

export interface CreateSkillPayload {
  name: string;
  level?: string | null;
}

export interface CreateProjectPayload {
  name: string;
  description: string;
  url?: string | null;
}

// ============ TIPOS PARA ATUALIZAÇÃO ============

export type UpdateCurriculumPayload = Partial<CreateCurriculumPayload>;
export type UpdateStatementPayload = Partial<CreateStatementPayload>;
export type UpdateEducationPayload = Partial<CreateEducationPayload>;
export type UpdateExperiencePayload = Partial<CreateExperiencePayload>;
export type UpdateSkillPayload = Partial<CreateSkillPayload>;
export type UpdateProjectPayload = Partial<CreateProjectPayload>;
