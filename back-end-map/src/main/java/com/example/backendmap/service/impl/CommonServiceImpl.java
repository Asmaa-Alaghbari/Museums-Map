package com.example.backendmap.service.impl;

import com.example.backendmap.entity.Point;
import com.example.backendmap.entity.User;
import com.example.backendmap.payload.LoginDTO;
import com.example.backendmap.payload.RegisterDTO;
import com.example.backendmap.repository.PointRepository;
import com.example.backendmap.repository.UserRepository;
import com.example.backendmap.service.CommonService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

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
        Optional<User> user_isi = userRepository.findByUsername(loginDTO.getUsername());
        log.info("enter login");
        log.info(loginDTO.getUsername());
        log.info(loginDTO.getPassword());
        if (user_isi.isPresent()) {
            log.info(user_isi.get().getPassword());
            log.info(loginDTO.getPassword());
            if (Objects.equals(user_isi.get().getPassword(), loginDTO.getPassword())) {
                log.info("pass login");
                return "success";
            } else {
                log.info("fail login");
                return "fail";
            }
        }
        log.info("fail login");
        return "fail";
    }

    @Override
    public String register(RegisterDTO registerDTO) {
        Optional<User> user_isi = userRepository.findByUsername(registerDTO.getUsername());
        if (user_isi.isPresent()) {
            return "duplicated";
        }
        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setPassword(registerDTO.getPassword());
        userRepository.save(user);
        return "success";
    }

    @Override
    public List<Point> getPoints() {
        return pointRepository.findAll();
    }

}
