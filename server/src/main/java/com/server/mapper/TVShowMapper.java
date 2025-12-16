package com.server.mapper;

import com.server.dto.CreateTVShowRequest;
import com.server.dto.TVShowResponse;
import com.server.model.TVShowEntity;

public class TVShowMapper {

    public static TVShowEntity toEntity(CreateTVShowRequest req) {
        TVShowEntity tv = new TVShowEntity();
        tv.setName(req.name);
        tv.setYear(req.year);
        tv.setAudience(req.audience);
        tv.setSeasons(req.seasons);
        tv.setGenre(req.genre);
        tv.setStatus(req.status);
        tv.setDescription(req.description);
        tv.setStreaming(req.streaming);
        tv.setNewSeason(req.newSeason);
        tv.setPoster(req.poster);
        tv.setBanner(req.banner);
        tv.setLogo(req.logo);
        tv.setLikes(0); // default
        return tv;
    }

    public static TVShowResponse toResponse(TVShowEntity tv) {
        return new TVShowResponse(
                tv.getId(),
                tv.getName(),
                tv.getYear(),
                tv.getAudience(),
                tv.getSeasons(),
                tv.getGenre(),
                tv.getStatus(),
                tv.getDescription(),
                tv.getStreaming(),
                tv.getLikes(),
                tv.getNewSeason(),
                tv.getPoster(),
                tv.getBanner(),
                tv.getLogo()
        );
    }
}
