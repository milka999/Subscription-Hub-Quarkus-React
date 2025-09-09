package org.ucg.resource.model;

import jakarta.validation.constraints.Min;
import jakarta.ws.rs.DefaultValue;
import lombok.Data;
import org.jboss.resteasy.reactive.RestQuery;
import org.springframework.data.domain.Sort;

@Data
public class PaginationParams {

    @RestQuery
    @Min(0)
    @DefaultValue("0")
    private Integer page;

    @RestQuery
    @Min(1)
    @DefaultValue("10")
    private Integer rows;

    @DefaultValue("id")
    @RestQuery
    private String sortBy;

    @DefaultValue("false")
    @RestQuery
    private boolean descending;

    public Sort getDefaultSort() {
        var sort = Sort.by(sortBy);

        if (descending) {
            sort = sort.descending();
        }

        return sort;
    }

    public Sort getSortWithPrefix(String prefix) {
        var sort = Sort.by(prefix + "." + sortBy);

        if (descending) {
            sort = sort.descending();
        }

        return sort;
    }

}

