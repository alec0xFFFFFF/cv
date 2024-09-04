export interface Photo {
  filename: string;
  description?: string;
  film_format?: string;
  film_stock?: string;
  similarity_score?: number;
  quality_grade?: number;
  location?: string;
  lens?: string;
  processing_lab?: string;
  camera?: string;
}
