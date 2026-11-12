CREATE TABLE `teacher_work_metrics` (
    `work_id` VARCHAR(191) NOT NULL,
    `view_count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    PRIMARY KEY (`work_id`),
    CONSTRAINT `teacher_work_metrics_work_id_fkey` FOREIGN KEY (`work_id`)
        REFERENCES `teacher_works`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
