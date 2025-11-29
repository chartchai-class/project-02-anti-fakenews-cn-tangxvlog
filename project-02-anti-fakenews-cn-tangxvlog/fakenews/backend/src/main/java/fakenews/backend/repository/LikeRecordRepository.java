package fakenews.backend.repository;

import fakenews.backend.model.LikeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface LikeRecordRepository extends JpaRepository<LikeRecord, String> {
    boolean existsByNewsIdAndClientId(Long newsId, String clientId);

    @Modifying
    @Transactional
    @Query("delete from LikeRecord r where r.news.id = :newsId and r.clientId = :clientId")
    void deleteByNewsIdAndClientId(@Param("newsId") Long newsId, @Param("clientId") String clientId);
}
