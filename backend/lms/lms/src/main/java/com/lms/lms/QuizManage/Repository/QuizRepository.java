package com.lms.lms.QuizManage.Repository;

import com.lms.lms.QuizManage.Entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, String> {
    boolean existsById(String id);
}