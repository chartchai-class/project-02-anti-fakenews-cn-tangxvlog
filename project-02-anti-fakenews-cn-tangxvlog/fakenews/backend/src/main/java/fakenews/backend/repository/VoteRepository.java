package fakenews.backend.repository;

import fakenews.backend.model.Vote;
import fakenews.backend.model.VoteChoice;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface VoteRepository extends JpaRepository<Vote, String> {
    long countByNewsIdAndChoice(Long newsId, VoteChoice choice);

    @Query("select v from Vote v where v.news.id = :newsId and (v.comment is not null or v.imageUrl is not null) order by v.createdAt desc")
    List<Vote> findCommentsByNewsId(@Param("newsId") Long newsId, Pageable pageable);

    @Modifying
    @Transactional
    @Query("delete from Vote v where v.news.id = :newsId")
    void deleteByNewsId(@Param("newsId") Long newsId);
}
