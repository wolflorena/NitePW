package com.server.dto;

import java.time.LocalDate;

public class TVShowUpdateRequest {

    public String name;
    public Integer year;
    public String audience;
    public Integer seasons;
    public String genre;
    public String status;
    public String description;
    public String streaming;
    public Integer likes;
    public LocalDate newSeason;

    // base64 strings
    public String poster;
    public String banner;
    public String logo;
}
