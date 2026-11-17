-- Keep all existing RPG teacher resources unchanged. New NarAgent HTML
-- publications are explicitly typed and become filterable in the plaza.
ALTER TABLE `teacher_works`
  ADD COLUMN `resource_type` ENUM('RPG', 'INTERACTIVE_HTML') NOT NULL DEFAULT 'RPG';
