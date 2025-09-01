<?php
include_once 'gallery.php';

$uploadDir = 'gallery/';

if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DigitalArt Gallery 🎨</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-LN+7fdVzj6u52u30Kp6M/trliBMCMKTyK833zpbD+pXdCLuTusPj697FH4R/5mcr" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="#home">
                <i class="bi bi-palette-fill text-primary me-2"></i>DigitalArt Gallery
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#home">홈</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#exhibition">전시관</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#upload">작품 업로드</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#about">소개</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <main>
        <section id="home" class="py-5 bg-light">
            <div class="container">
                <div class="row justify-content-center text-center">
                    <div class="col-lg-8">
                        <h1 class="display-4 fw-bold text-dark mb-4">디지털 아트의 새로운 세계</h1>
                        <p class="lead text-muted mb-4">창의적인 디지털 작품들을 전시하고 공유하는 온라인 갤러리입니다.</p>
                        <p class="text-muted">GIF 애니메이션 작품을 업로드하여 전 세계와 공유해보세요!</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="upload" class="py-5">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="card shadow-sm">
                            <div class="card-body p-4">
                                <h3 class="card-title text-center mb-4">
                                    <i class="bi bi-upload text-primary me-2"></i>새로운 작품 업로드
                                </h3>
                                <p class="text-center text-muted mb-4">GIF 형식의 디지털 아트 작품만 업로드 가능합니다.</p>
                                
                                <form action="index.php" method="post" enctype="multipart/form-data">
                                    <div class="mb-3">
                                        <label for="artwork" class="form-label">작품 파일 선택 (GIF 전용)</label>
                                        <input type="file" class="form-control" name="artwork" id="artwork" accept=".gif" required>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="title" class="form-label">작품 제목</label>
                                        <input type="text" class="form-control" name="title" id="title" placeholder="작품의 제목을 입력하세요" required>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="artist" class="form-label">작가명</label>
                                        <input type="text" class="form-control" name="artist" id="artist" placeholder="작가명을 입력하세요" required>
                                    </div>
                                    
                                    <div class="mb-4">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" name="curator_mode" value="1" id="curatorMode">
                                            <label class="form-check-label" for="curatorMode">
                                                <i class="bi bi-gear-fill text-warning me-1"></i>큐레이터 모드 (고급 분석 활성화)
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <button type="submit" name="submit_artwork" class="btn btn-primary w-100">
                                        <i class="bi bi-upload me-2"></i>작품 업로드
                                    </button>
                                </form>

                                <div class="mt-4">
                                <?php
                                if (isset($_POST["submit_artwork"])) {
                                    $uploadSuccess = true;
                                    $uploadDirectory = "gallery/";
                                    
                                    if (!file_exists($uploadDirectory)) {
                                        mkdir($uploadDirectory, 0777, true);
                                    }
                                    
                                    if (!isset($_FILES["artwork"]) || $_FILES["artwork"]["error"] !== UPLOAD_ERR_OK) {
                                        echo '<div class="alert alert-danger" role="alert"><i class="bi bi-exclamation-triangle me-2"></i>파일 업로드 중 오류가 발생했습니다.</div>';
                                        $uploadSuccess = false;
                                    } else {
                                        $tmpFile = $_FILES["artwork"]["tmp_name"];
                                        $originalName = $_FILES["artwork"]["name"];
                                        $fileExtension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
                                        $title = htmlspecialchars($_POST["title"]);
                                        $artist = htmlspecialchars($_POST["artist"]);

                                        if (mime_content_type($tmpFile) !== "image/gif" || $fileExtension !== "gif") {
                                            echo '<div class="alert alert-danger" role="alert"><i class="bi bi-exclamation-triangle me-2"></i>GIF 형식의 작품만 업로드 가능합니다!</div>';
                                            $uploadSuccess = false;
                                        }

                                        if ($uploadSuccess) {
                                            $artworkId = "art_" . date("Ymd_His") . "_" . substr(md5($title . $artist), 0, 8);
                                            $targetFile = $uploadDirectory . $artworkId . "." . $fileExtension;
                                            
                                            if (move_uploaded_file($tmpFile, $targetFile)) {
                                                echo '<div class="alert alert-success" role="alert">';
                                                echo '<h5 class="alert-heading"><i class="bi bi-check-circle me-2"></i>작품 업로드 성공!</h5>';
                                                echo '<p class="mb-1"><strong>제목:</strong> ' . $title . '</p>';
                                                echo '<p class="mb-1"><strong>작가:</strong> ' . $artist . '</p>';
                                                echo '<p class="mb-0"><strong>파일 ID:</strong> ' . $artworkId . '</p>';
                                                echo '</div>';
                                                
                                                if (isset($_POST['curator_mode'])) {
                                                    echo '<div class="alert alert-warning" role="alert">';
                                                    echo '<h6 class="alert-heading"><i class="bi bi-search me-2"></i>큐레이터 고급 분석</h6>';
                                                    
                                                    $analysisPath = 'phar://' . $targetFile;
                                                    
                                                    if (file_exists($analysisPath)) {
                                                        echo '<p class="mb-1"><i class="bi bi-check-circle me-2"></i>작품의 메타데이터 분석이 완료되었습니다.</p>';
                                                        echo '<p class="mb-0"><i class="bi bi-graph-up me-2"></i>파일 구조: 고급 분석됨</p>';
                                                    } else {
                                                        echo '<p class="mb-0"><i class="bi bi-exclamation-triangle me-2"></i>분석할 수 없는 파일 형식입니다.</p>';
                                                    }
                                                    echo '</div>';
                                                } else {
                                                    if (file_exists($targetFile)) {
                                                        $fileSize = filesize($targetFile);
                                                        echo '<div class="alert alert-info" role="alert">';
                                                        echo '<i class="bi bi-info-circle me-2"></i>파일 크기: ' . number_format($fileSize) . ' bytes';
                                                        echo '</div>';
                                                    }
                                                }
                                            } else {
                                                echo '<div class="alert alert-danger" role="alert"><i class="bi bi-exclamation-triangle me-2"></i>업로드 중 오류가 발생했습니다.</div>';
                                            }
                                        }
                                    }
                                }
                                ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="exhibition" class="py-5 bg-light">
            <div class="container">
                <h3 class="text-center mb-5">
                    <i class="bi bi-images text-primary me-2"></i>현재 전시 중인 작품들
                </h3>
                <div class="row g-4">
                    <?php
                    $galleryDir = "gallery/";
                    if (is_dir($galleryDir)) {
                        $artworks = array_diff(scandir($galleryDir), array('.', '..'));
                        $artworkCount = 0;
                        
                        foreach ($artworks as $artwork) {
                            if (pathinfo($artwork, PATHINFO_EXTENSION) === 'gif' && $artworkCount < 6) {
                                echo '<div class="col-md-6 col-lg-4">';
                                echo '<div class="card h-100 shadow-sm">';
                                echo '<img src="' . $galleryDir . $artwork . '" class="card-img-top" alt="Digital Art" style="height: 200px; object-fit: cover;">';
                                echo '<div class="card-body">';
                                echo '<p class="card-text text-muted small">' . $artwork . '</p>';
                                echo '</div>';
                                echo '</div>';
                                echo '</div>';
                                $artworkCount++;
                            }
                        }
                        
                        if ($artworkCount === 0) {
                            echo '<div class="col-12 text-center">';
                            echo '<div class="alert alert-info" role="alert">';
                            echo '<i class="bi bi-info-circle me-2"></i>아직 전시된 작품이 없습니다. 첫 번째 작품을 업로드해보세요!';
                            echo '</div>';
                            echo '</div>';
                        }
                    }
                    ?>
                </div>
            </div>
        </section>

        <section id="about" class="py-5">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-8 text-center">
                        <h3 class="mb-4">
                            <i class="bi bi-info-circle text-primary me-2"></i>DigitalArt Gallery 소개
                        </h3>
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="card h-100 border-0 shadow-sm">
                                    <div class="card-body">
                                        <i class="bi bi-palette-fill text-primary fs-1 mb-3"></i>
                                        <h5 class="card-title">디지털 아트 전시</h5>
                                        <p class="card-text text-muted">창의적인 디지털 작품들을 전시하고 공유하는 온라인 갤러리입니다.</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card h-100 border-0 shadow-sm">
                                    <div class="card-body">
                                        <i class="bi bi-gear-fill text-warning fs-1 mb-3"></i>
                                        <h5 class="card-title">큐레이터 모드</h5>
                                        <p class="card-text text-muted">작품의 메타데이터와 구조를 심층 분석할 수 있습니다.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="bg-dark text-light py-4 mt-5">
        <div class="container text-center">
            <p class="mb-0">&copy; 2025 DigitalArt Gallery. 모든 작품의 저작권은 각 작가에게 있습니다.</p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.7/dist/js/bootstrap.bundle.min.js" integrity="sha384-ndDqU0Gzau9qJ1lfW4pNLlhNTkCfHzAVBReH9diLvGRem5+R9g2FzA8ZGN954O5Q" crossorigin="anonymous"></script>
</body>
</html>
