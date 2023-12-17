package com.example.backendmap.entity;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotFavPoint {
    List<String> notFavorPoints;
}
