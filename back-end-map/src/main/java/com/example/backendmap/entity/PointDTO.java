package com.example.backendmap.entity;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PointDTO {
    private Float longitude;
    private Float latitude;
}
