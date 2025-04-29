import { Injectable } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
	private supabase;

	constructor() {
		this.supabase = createClient(
			process.env.SUPABASE_URL || "",
			process.env.SUPABASE_KEY || "",
		);
	}

	async uploadFile(
		bucketName: string,
		fileName: string,
		fileBuffer: Buffer,
		mimeType: string,
	): Promise<{ imgUrl: string }> {
		const { data: uploadData, error } = await this.supabase.storage
			.from(bucketName)
			.upload(fileName, fileBuffer, {
				contentType: mimeType,
				upsert: true,
			});

		if (error) {
			throw new Error(error.message);
		}

		const { data } = this.supabase.storage
			.from(bucketName)
			.getPublicUrl(uploadData.path);

		return {
			imgUrl: data.publicUrl,
		};
	}
}
