package com.example.backendmap.service.impl;

import com.example.backendmap.entity.*;
import com.example.backendmap.payload.LoginDTO;
import com.example.backendmap.payload.RegisterDTO;
import com.example.backendmap.repository.PointRepository;
import com.example.backendmap.repository.UserRepository;
import com.example.backendmap.service.CommonService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
public class CommonServiceImpl implements CommonService {

    private final UserRepository userRepository;
    private final PointRepository pointRepository;


    public CommonServiceImpl(UserRepository userRepository, PointRepository pointRepository) {
        this.userRepository = userRepository;
        this.pointRepository = pointRepository;
    }

    @Override
    public String login(LoginDTO loginDTO) {
        User user_isi = userRepository.findByUsername(loginDTO.getUsername());
        log.info("enter login");
        log.info(loginDTO.getUsername());
        log.info(loginDTO.getPassword());
        log.info(user_isi.getPassword());
        log.info(loginDTO.getPassword());
        if (Objects.equals(user_isi.getPassword(), loginDTO.getPassword())) {
            log.info("pass login");
            return "success";
        } else {
            log.info("fail login");
            return "fail";
        }
    }

    @Override
    public String register(RegisterDTO registerDTO) {
        User user_isi = userRepository.findByUsername(registerDTO.getUsername());
        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setPassword(registerDTO.getPassword());
        userRepository.save(user);
        return "success";
    }

    @Override
    public List<Point> getPoints() {
        List<Point> points = pointRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
        return points.subList(0, 5);
    }

    @Override
    public String addPointToUser(List<PointDTO> points, String username) {
        User user_isi = userRepository.findByUsername(username);
        Set<Point> favorPoints = new HashSet<>();
        for (PointDTO point : points) {
            Optional<Point> optionalPoint = pointRepository.findByLatitudeAndLongitude(point.getLatitude(), point.getLongitude());
            optionalPoint.ifPresent(favorPoints::add);
        }
        user_isi.setPoints(favorPoints);
        userRepository.save(user_isi);
        return "success";
    }

    @Override
    public String removePointFromUser(List<PointDTO> points, String username) {
        User user_isi = userRepository.findByUsername(username);
        Set<Point> favorPoints = user_isi.getPoints();
        for (PointDTO point : points) {
            Optional<Point> optionalPoint = pointRepository.findByLatitudeAndLongitude(point.getLatitude(), point.getLongitude());
            optionalPoint.ifPresent(favorPoints::remove);
        }
        user_isi.setPoints(favorPoints);
        userRepository.save(user_isi);
        return "success";
    }

    @Override
    public Set<Point> getFavoritePoint(String username) {

        User user_isi = userRepository.findByUsername(username);
        return user_isi.getPoints();
    }

    @Override
    public List<Point> getAllPoints() {
        return pointRepository.findAll();
    }

    @Override
    public String addFavoritePoint(FavPoint favPoint, String username) {
        log.info("add");
        User user_isi = userRepository.findByUsername(username);

        Set<Point> curPoints = user_isi.getPoints();
        Set<Point> pointSet = new HashSet<>(curPoints);

        for (String name : favPoint.getFavorPoints()) {
            log.info(name);
            Point point = pointRepository.findByName(name);
            log.info(point.getId().toString());
            pointSet.add(point);
        }
        log.info("new add");
        user_isi.setPoints(new HashSet<>(pointSet));
        userRepository.save(user_isi);
        return "success";
    }

    @Override
    public String removeFavoritePoint(NotFavPoint notFavPoint, String username) {
        log.info("remove");
        User user_isi = userRepository.findByUsername(username);

        Set<Point> curPoints = user_isi.getPoints();
        Set<Point> pointSet = new HashSet<>(curPoints);

        pointSet.removeIf(point -> notFavPoint.getNotFavorPoints().contains(point.getName()));

        user_isi.setPoints(new HashSet<>(pointSet));
        userRepository.save(user_isi);
        return "success";
    }

}
