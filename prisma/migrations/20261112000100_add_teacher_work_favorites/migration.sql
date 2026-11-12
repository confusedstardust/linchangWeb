CREATE TABLE `teacher_work_favorites` (
    `user_id` VARCHAR(191) NOT NULL,
    `work_id` VARCHAR(191) NOT NULL,
    PRIMARY KEY (`user_id`, `work_id`),
    INDEX `teacher_work_favorites_work_id_idx` (`work_id`),
    CONSTRAINT `teacher_work_favorites_user_id_fkey` FOREIGN KEY (`user_id`)
        REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `teacher_work_favorites_work_id_fkey` FOREIGN KEY (`work_id`)
        REFERENCES `teacher_works`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
