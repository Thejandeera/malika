package com.lms.lms.QuizManage.Cotroller;

import com.lms.lms.QuizManage.DTO.AttemptQuizDTO;
import com.lms.lms.QuizManage.DTO.QuizDTO;
import com.lms.lms.QuizManage.Service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;

    @Autowired
    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    // Create new quiz
    @PostMapping
    public ResponseEntity<QuizDTO> createQuiz(@RequestBody QuizDTO quizDTO) {
        QuizDTO createdQuiz = quizService.createQuiz(quizDTO);
        return new ResponseEntity<>(createdQuiz, HttpStatus.CREATED);
    }

    // Get quiz by ID
    @GetMapping("/{quizId}")
    public ResponseEntity<QuizDTO> getQuizById(@PathVariable String quizId) {
        QuizDTO quiz = quizService.getQuizById(quizId);
        return ResponseEntity.ok(quiz);
    }


    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateQuizId(@RequestBody AttemptQuizDTO attemptQuizDTO) {
        boolean exists = quizService.checkQuizExists(attemptQuizDTO.getQuizId());
        if (exists) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(false);
        }
    }


    @GetMapping("/generate-id")
    public ResponseEntity<String> generateQuizId() {
        String quizId = quizService.generateUniqueQuizId();
        return ResponseEntity.ok(quizId);
    }
}
