package fakenews.backend.repository;

import fakenews.backend.model.Comment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, String> {
    @Query("select c from Comment c where c.news.id = :newsId order by c.createdAt desc")
    List<Comment> findByNewsId(@Param("newsId") Long newsId, Pageable pageable);

    @Modifying
    @Transactional
    @Query("delete from Comment c where c.news.id = :newsId")
    void deleteByNewsId(@Param("newsId") Long newsId);
}

