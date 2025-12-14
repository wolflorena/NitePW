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
        TVShowResponse res = new TVShowResponse();
        res.id = tv.getId();
        res.name = tv.getName();
        res.year = tv.getYear();
        res.audience = tv.getAudience();
        res.seasons = tv.getSeasons();
        res.genre = tv.getGenre();
        res.status = tv.getStatus();
        res.description = tv.getDescription();
        res.streaming = tv.getStreaming();
        res.likes = tv.getLikes();
        res.newSeason = tv.getNewSeason();
        res.poster = tv.getPoster();
        res.banner = tv.getBanner();
        res.logo = tv.getLogo();
        return res;
    }
}
