package org.ucg.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(BaseEntity.EntityListener.class)
@FilterDef(name = "deletedFilter", parameters = @ParamDef(name = "includeDeleted", type = Boolean.class))
@Filter(name = "deletedFilter", condition = "deleted_at IS NULL OR :includeDeleted = true")
public class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at", nullable = false, updatable = false)
    @NotNull
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }

    public void restore() {
        this.deletedAt = null;
    }

    public boolean isDeleted() {
        return this.deletedAt != null;
    }

    public static class EntityListener {
        @PrePersist
        public void prePersist(BaseEntity entity) {
            if (entity.getCreatedAt() == null) {
                entity.setCreatedAt(LocalDateTime.now());
            }
        }

        @PreUpdate
        public void preUpdate(BaseEntity entity) {
            entity.setUpdatedAt(LocalDateTime.now());
        }
    }
}